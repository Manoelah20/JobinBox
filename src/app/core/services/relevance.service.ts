import { Injectable } from '@angular/core';
import type { OpportunityType } from './opportunity.service';

@Injectable({
  providedIn: 'root',
})
export class RelevanceService {
  calculate(content: string, technologies: string[], opportunityType?: OpportunityType): number {
    const normalizedContent = content.toLowerCase();

    let score = 0;

    // Tipo da oportunidade
    switch (opportunityType) {
      case 'CLT':
      case 'PJ':
      case 'Estágio':
      case 'Trainee':
        score += 30;
        break;

      case 'Curso':
        score += 10;
        break;

      case 'Evento':
      case 'Outro':
        score += 5;
        break;
    }

    // Tecnologias encontradas
    score += Math.min(technologies.length * 8, 32);

    // Front-end + Júnior
    const isFrontend = /front[- ]?end|desenvolvedor front|desenvolvedora front/i.test(content);

    const isJunior = /j[uú]nior|jr/i.test(content);

    if (isFrontend && isJunior) {
      score += 12;
    }

    // Tecnologias relevantes para Front-End
    const relevantTechs = [
      'react',
      'next.js',
      'typescript',
      'javascript',
      'angular',
      'vue.js',
      'node.js',
      'nodejs',
      'html',
      'css',
    ];

    for (const tech of relevantTechs) {
      if (normalizedContent.includes(tech)) {
        score += 5;
      }
    }

    // Modalidade remota
    if (/remota|remoto|remote|home office/i.test(content)) {
      score += 5;
    }

    return Math.min(score, 100);
  }
}
