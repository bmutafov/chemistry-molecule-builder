class ElementHolder {
  constructor() {
    const color = '#fff4b5';
    let rect = RoughElement.create('rectangle').prop({
      size: { width: 800, height: 150 },
      position: { x: 0, y: 0 },
      attrs: {
        body: {
          rough: {
            hachureAngle: 60,
            hachureGap: 10,
            fillStyle: 'zigzag-line'
          },
          fill: color,
          stroke: color
        },
        border: {
          rough: {
            hachureAngle: 60,
            hachureGap: 8
          }
        },
        label: {
          refX: 100,
          refY: 10,
          text: 'Available elements'
        }
      }
    });
    rect.set('isModifiable', false);
    return rect;
  }
}

class Element {
  constructor(bodyColor, labelColor, label) {
    this.width = 70;
    this.height = 70;

    let el = RoughElement.create('ellipse').prop({
      size: { width: 70, height: 70 },
      position: { x: 0, y: 0 },
      attrs: {
        body: {
          rough: {
            hachureGap: 5,
            fillStyle: 'solid'
          },
          stroke: bodyColor,
          fill: bodyColor
        },
        label: {
          text: label,
          stroke: labelColor
        }
      }
    });
    el.set('isModifiable', true);
    return el;
  }
}

class Oxygen extends Element {
  constructor() {
    return super('#f0f0f0', '#333333', 'O');
  }
}

class Hydrogen extends Element {
  constructor() {
    return super('#ff4747', '#ffffff', 'H');
  }
}

class Carbon extends Element {
  constructor() {
    return super('#f7af2a', '#333333', 'C');
  }
}

class Helium extends Element {
  constructor() {
    return super('#69ffca', '#333333', 'He');
  }
}