import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RelevanceService {
    calculate(
        content: string,
        technologies: string[],
        opportunityType?: string
    ): number {
        const normalizedContent = content.toLowerCase();

        let score = 0;

        // Tipo da oportunidade
        if (
            opportunityType === 'CLT' ||
            opportunityType === 'PJ' ||
            opportunityType === 'Estágio' ||
            opportunityType === 'Trainee'
        ) {
            score += 30;
        }

        if (opportunityType === 'Curso') {
            score += 10;
        }

        // Tecnologias encontradas
        score += Math.min(technologies.length * 8, 32);

        // Tecnologias especialmente relevantes para Front-End
        const relevantTechnologies = [
            'react',
            'next.js',
            'typescript',
            'javascript',
            'angular',
            'vue.js',
        ];

        for (const technology of relevantTechnologies) {
            if (normalizedContent.includes(technology)) {
                score += 5;
            }
        }

        // Área Front-End
        const frontendKeywords = [
            'front-end',
            'frontend',
            'desenvolvedora front',
            'desenvolvedor front',
            'frontend developer',
            'front-end developer',
        ];

        if (
            frontendKeywords.some((keyword) =>
                normalizedContent.includes(keyword)
            )
        ) {
            score += 10;
        }

        // Nível Júnior
        if (/\bj[uú]nior\b|\bjr\b/i.test(content)) {
            score += 8;
        }

        // Modalidade remota
        if (
            /remota|remoto|home office|100%\s*remoto|remote/i.test(
                content
            )
        ) {
            score += 5;
        }

        // CLT ou PJ
        if (/\bCLT\b/i.test(content)) {
            score += 3;
        }

        if (/\bPJ\b/i.test(content)) {
            score += 3;
        }

        return Math.min(score, 100);
    }
}