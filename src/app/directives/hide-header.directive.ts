import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
 
enum Direction {
  UP = 1,
  DOWN = 0
}
@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective {
 
  @Input('appHideHeader') header: any;
  readonly scrollDistance = 50;
  previousY = 0;
  direction: Direction = Direction.DOWN;
  saveY = 0;
 
  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController
  ) { }
 
  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
 
    // Skip some events that create ugly glitches
    if ($event.detail.currentY <= 0 || $event.detail.currentY == this.saveY){
      return;
    }
 
    const scrollTop: number = $event.detail.scrollTop;
    let newDirection = Direction.DOWN;
 
    // Calculate the distance from top based on the previousY
    // which is set when we change directions
    let newPosition = -scrollTop + this.previousY;
 
    // We are scrolling up the page
    // In this case we need to reduce the position first
    // to prevent it jumping from -50 to 0
    if (this.saveY > $event.detail.currentY) {
      newDirection = Direction.UP;
      newPosition -= this.scrollDistance;
    }
 
    // Make our maximum scroll distance the end of the range
    if (newPosition < -this.scrollDistance) {
      newPosition = -this.scrollDistance;
    }
    
    // Calculate opacity between 0 and 1
    let newOpacity = 1 - (newPosition / -this.scrollDistance);
 
    // Move and set the opacity of our element
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'top', Math.min(0, newPosition) + 'px');
      this.renderer.setStyle(this.header, 'opacity', newOpacity);
    });
 
    // Store the current Y value to see in which direction we scroll
    this.saveY = $event.detail.currentY;
 
    // If the direction changed, store the point of change for calculation
    if (newDirection != this.direction) {
      this.direction = newDirection;
      this.previousY = scrollTop;
    }
 
  }
}