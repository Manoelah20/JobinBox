import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpportunityService, Opportunity } from '../../core/services/opportunity.service';

@Component({
  selector: 'app-import',
  imports: [CommonModule, FormsModule],
  templateUrl: './import.html',
  styleUrl: './import.css',
})
export class Import {
  private readonly opportunityService = inject(OpportunityService);

  protected readonly isDragging = signal(false);
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly previewData = signal<Opportunity[] | null>(null);
  protected readonly importResult = signal<{ added: number; updated: number; errors: string[] } | null>(null);
  protected readonly isImporting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  protected onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    this.errorMessage.set(null);
    this.importResult.set(null);
    this.previewData.set(null);

    if (!this.isValidFile(file)) {
      this.errorMessage.set('Formato não suportado. Use .json ou .csv');
      return;
    }

    this.selectedFile.set(file);
    this.readAndParseFile(file);
  }

  private isValidFile(file: File): boolean {
    const validTypes = ['application/json', 'text/csv', 'application/csv'];
    const validExtensions = ['.json', '.csv'];
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    return hasValidType || hasValidExtension;
  }

  private readAndParseFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: Partial<Opportunity>[] = [];

        if (file.name.toLowerCase().endsWith('.json') || file.type === 'application/json') {
          data = JSON.parse(content);
          if (!Array.isArray(data)) {
            throw new Error('JSON deve ser um array de objetos');
          }
        } else {
          data = this.parseCsv(content);
        }

        this.previewData.set(data as Opportunity[]);
      } catch (err) {
        this.errorMessage.set(`Erro ao ler arquivo: ${err instanceof Error ? err.message : 'Formato inválido'}`);
      }
    };
    reader.onerror = () => {
      this.errorMessage.set('Erro ao ler o arquivo');
    };
    reader.readAsText(file);
  }

  private parseCsv(csvText: string): Partial<Opportunity>[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const data: Partial<Opportunity>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => (row[h] = values[idx] || ''));
      data.push(this.mapCsvRow(row));
    }
    return data;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map((v) => v.replace(/^"|"$/g, ''));
  }

  private mapCsvRow(row: Record<string, string>): Partial<Opportunity> {
    const techStr = row['technologies'] || row['tecnologias'] || '';
    const technologies = techStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    return {
      title: row['title'] || row['título'] || row['vaga'] || '',
      company: row['company'] || row['empresa'] || '',
      technologies,
      type: row['type'] || row['tipo'] || 'CLT',
      status: row['status'] || 'Nova',
      workMode: row['workMode'] || row['modalidade'] || row['work_mode'],
      description: row['description'] || row['descrição'] || row['descricao'],
      link: row['link'] || row['url'],
      salary: row['salary'] || row['salário'] || row['salario'],
      location: row['location'] || row['localização'] || row['localizacao'],
    };
  }

  protected confirmImport(): void {
    if (!this.previewData()) return;
    this.isImporting.set(true);
    this.errorMessage.set(null);

    try {
      const result = this.opportunityService.importFromJson(this.previewData() as Opportunity[]);
      this.importResult.set(result);
      this.previewData.set(null);
      this.selectedFile.set(null);
    } catch (err) {
      this.errorMessage.set(`Erro ao importar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      this.isImporting.set(false);
    }
  }

  protected cancelImport(): void {
    this.previewData.set(null);
    this.selectedFile.set(null);
    this.errorMessage.set(null);
    this.importResult.set(null);
  }

  protected getPreviewCount(): number {
    return this.previewData()?.length || 0;
  }

  protected formatTechnologies(techs: string | string[]): string {
    if (Array.isArray(techs)) return techs.join(', ');
    return techs;
  }
}