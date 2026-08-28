import { RelevanceService } from './relevance.service';

describe('RelevanceService', () => {
  let service: RelevanceService;

  beforeEach(() => {
    service = new RelevanceService();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('opportunity type', () => {
    it('should give 30 points for CLT', () => {
      const score = service.calculate('vaga desenvolvedor', [], 'CLT');

      expect(score).toBe(30);
    });

    it('should give 30 points for PJ', () => {
      const score = service.calculate('vaga desenvolvedor', [], 'PJ');

      expect(score).toBe(30);
    });

    it('should give 30 points for Estágio', () => {
      const score = service.calculate('vaga desenvolvedor', [], 'Estágio');

      expect(score).toBe(30);
    });

    it('should give 30 points for Trainee', () => {
      const score = service.calculate('vaga desenvolvedor', [], 'Trainee');

      expect(score).toBe(30);
    });

    it('should give 10 points for Curso', () => {
      const score = service.calculate('curso de desenvolvimento', [], 'Curso');

      expect(score).toBe(10);
    });

    it('should give 5 points for Evento', () => {
      const score = service.calculate('evento de tecnologia', [], 'Evento');

      expect(score).toBe(5);
    });

    it('should give 5 points for Outro', () => {
      const score = service.calculate('oportunidade', [], 'Outro');

      expect(score).toBe(5);
    });
  });

  describe('technologies', () => {
    it('should add points based on the number of technologies', () => {
      const score = service.calculate('vaga desenvolvedor', ['React', 'TypeScript'], 'Outro');

      expect(score).toBe(21);
    });

    it('should limit technology base points to 32', () => {
      const technologies = ['React', 'Angular', 'Vue.js', 'Next.js', 'TypeScript'];

      const score = service.calculate('vaga desenvolvedor', technologies, 'Outro');

      expect(score).toBe(37);
    });
  });

  describe('frontend and junior', () => {
    it('should add points for frontend junior opportunities', () => {
      const score = service.calculate('Vaga Front-End Developer Jr', [], 'Outro');

      expect(score).toBe(17);
    });

    it('should recognize júnior with accent', () => {
      const score = service.calculate('Vaga Front-End Developer Júnior', [], 'Outro');

      expect(score).toBe(17);
    });
  });

  describe('relevant frontend technologies', () => {
    it('should add points for relevant technologies mentioned in the content', () => {
      const score = service.calculate('Vaga Front-End com React e TypeScript', [], 'Outro');

      expect(score).toBe(15);
    });
  });

  describe('remote work', () => {
    it('should add points for remote opportunities', () => {
      const score = service.calculate('Vaga Front-End remota', [], 'Outro');

      expect(score).toBe(10);
    });

    it('should recognize home office', () => {
      const score = service.calculate('Vaga de desenvolvimento em home office', [], 'Outro');

      expect(score).toBe(10);
    });
  });

  describe('score limit', () => {
    it('should never return a score greater than 100', () => {
      const technologies = [
        'React',
        'Angular',
        'Vue.js',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'Node.js',
        'Python',
        'Java',
        'Docker',
        'AWS',
        'Flutter',
        'Dart',
        'RxJS',
        'MongoDB',
        'PostgreSQL',
        'MySQL',
      ];

      const score = service.calculate(
        'Vaga Front-End Developer Júnior remota com React, Angular, TypeScript, JavaScript, Node.js, HTML e CSS',
        technologies,
        'CLT',
      );

      expect(score).toBe(100);
    });
  });

  describe('empty input', () => {
    it('should return 0 when no opportunity type or technologies are provided', () => {
      const score = service.calculate('oportunidade', []);

      expect(score).toBe(0);
    });
  });
});
