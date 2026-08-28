import type { OnInit, OnDestroy } from '@angular/core';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
})
export class FocusTrapDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private previouslyFocusedElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];

  ngOnInit(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.updateFocusableElements();
    this.focusFirstElement();
  }

  ngOnDestroy(): void {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  @HostListener('keydown.tab', ['$event'])
  onTabKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    this.updateFocusableElements();

    if (this.focusableElements.length === 0) {
      return;
    }

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (keyboardEvent.shiftKey) {
      if (document.activeElement === firstElement) {
        keyboardEvent.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        keyboardEvent.preventDefault();
        firstElement.focus();
      }
    }
  }

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    const closeButton = this.elementRef.nativeElement.querySelector(
      '[data-focus-trap-close]',
    ) as HTMLElement;
    closeButton?.click();
  }

  private updateFocusableElements(): void {
    const focusableSelector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    const elements = this.elementRef.nativeElement.querySelectorAll(focusableSelector);
    this.focusableElements = Array.from(elements).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el.offsetParent !== null,
    );
  }

  private focusFirstElement(): void {
    this.updateFocusableElements();
    const autofocusElement = this.elementRef.nativeElement.querySelector(
      '[autofocus]',
    ) as HTMLElement | null;
    if (autofocusElement) {
      autofocusElement.focus();
    } else if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }
}
