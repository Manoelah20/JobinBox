import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    InboxService,
    ExtractedOpportunity,
} from '../../core/services/inbox.service';

@Component({
    selector: 'app-inbox',
    imports: [CommonModule],
    templateUrl: './inbox.html',
    styleUrl: './inbox.css',
})
export class Inbox {
    private readonly inboxService =
        inject(InboxService);

    protected readonly messages =
        this.inboxService.messages;

    protected readonly pendingCount =
        this.inboxService.pendingCount;

    protected readonly analyzedCount =
        this.inboxService.analyzedCount;

    protected readonly selectedMessageId =
        this.inboxService.selectedMessageId;

    protected readonly extractedOpportunity =
        this.inboxService.extractedOpportunity;

    protected readonly statusFilter = signal<
        'all' | 'pending' | 'analyzed'
    >('all');

    protected readonly typeFilter = signal<
        'Todos' |
        'Vaga' |
        'Curso' |
        'Evento' |
        'Outro'
    >('Todos');

    protected readonly filteredMessages =
        computed(() => {
            const status = this.statusFilter();
            const type = this.typeFilter();

            return this.messages().filter((message) => {
                const statusMatch =
                    status === 'all' ||
                    (status === 'pending' &&
                        !message.analyzed) ||
                    (status === 'analyzed' &&
                        message.analyzed);

                const typeMatch =
                    type === 'Todos' ||
                    message.type === type;

                return statusMatch && typeMatch;
            });
        });

    protected analyzeMessage(
        id: string,
        event: Event
    ): void {
        event.stopPropagation();

        this.inboxService.analyze(id);
    }

    protected markAsAnalyzed(
        id: string,
        event: Event
    ): void {
        event.stopPropagation();

        this.inboxService.markAsAnalyzed(id);
    }

    protected deleteMessage(
        id: string,
        event: Event
    ): void {
        event.stopPropagation();

        if (
            confirm(
                'Tem certeza que deseja excluir esta mensagem?'
            )
        ) {
            this.inboxService.delete(id);
        }
    }

    protected closeAnalysis(): void {
        this.inboxService.closeAnalysis();
    }

    protected createOpportunity(): void {
        const opportunity =
            this.extractedOpportunity();

        if (!opportunity) {
            return;
        }

        this.inboxService.addExtractedOpportunity();
    }

    protected updateOpportunityField(
        field: keyof ExtractedOpportunity,
        value: string
    ): void {
        this.inboxService.updateExtractedOpportunity({
            [field]: value,
        });
    }

    protected removeTechnology(
        technology: string
    ): void {
        const opportunity =
            this.extractedOpportunity();

        if (!opportunity) {
            return;
        }

        const technologies =
            opportunity.technologies.filter(
                (item) => item !== technology
            );

        this.inboxService.updateTechnologies(
            technologies
        );
    }

    protected addTechnology(
        event: Event
    ): void {
        const input =
            event.target as HTMLInputElement;

        const technology =
            input.value.trim();

        if (!technology) {
            return;
        }

        const opportunity =
            this.extractedOpportunity();

        if (!opportunity) {
            return;
        }

        const alreadyExists =
            opportunity.technologies.some(
                (item) =>
                    item.toLowerCase() ===
                    technology.toLowerCase()
            );

        if (alreadyExists) {
            input.value = '';
            return;
        }

        this.inboxService.updateTechnologies([
            ...opportunity.technologies,
            technology,
        ]);

        input.value = '';
    }

    protected addTechnologyFromInput(
        input: HTMLInputElement
    ): void {
        const technology =
            input.value.trim();

        if (!technology) {
            return;
        }

        const opportunity =
            this.extractedOpportunity();

        if (!opportunity) {
            return;
        }

        const alreadyExists =
            opportunity.technologies.some(
                (item) =>
                    item.toLowerCase() ===
                    technology.toLowerCase()
            );

        if (alreadyExists) {
            input.value = '';
            return;
        }

        this.inboxService.updateTechnologies([
            ...opportunity.technologies,
            technology,
        ]);

        input.value = '';
    }
}