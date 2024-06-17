const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const info = {
    A: document.getElementById('coordA'),
    B: document.getElementById('coordB'),
    C: document.getElementById('coordC'),
    D: document.getElementById('coordD'),
    intersections: document.getElementById('intersections')
};
let points = [];
let draggingPoint = null;
const modal = document.getElementById('modal');
const span = document.getElementsByClassName('close')[0];

function drawPoint(x, y, color = 'black') {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateInfo() {
    switch (points.length) {
        case 1: {
            const [A] = points;
            info.A.textContent = `(${A.x.toFixed(2)}, ${A.y.toFixed(2)})`;
            break;
        }
        case 2: {
            const [, B] = points;
            info.B.textContent = `(${B.x.toFixed(2)}, ${B.y.toFixed(2)})`;
            break;
        }
        case 3: {
            const [, , C] = points;
            info.C.textContent = `(${C.x.toFixed(2)}, ${C.y.toFixed(2)})`;
            break;
        }
        case 4: {
            const [A, B, C, D] = points;
            const radiusAB = distance(A, B);
            const radiusCD = distance(C, D);
            const intersections = findCircleIntersections(A, radiusAB, C, radiusCD);

            info.A.textContent = `(${A.x.toFixed(2)}, ${A.y.toFixed(2)})`;
            info.B.textContent = `(${B.x.toFixed(2)}, ${B.y.toFixed(2)})`;
            info.C.textContent = `(${C.x.toFixed(2)}, ${C.y.toFixed(2)})`;
            info.D.textContent = `(${D.x.toFixed(2)}, ${D.y.toFixed(2)})`;
            if (typeof (intersections) === 'string') {
                info.intersections.textContent = intersections;
            }
            else {
                info.intersections.textContent = intersections.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(', ');
            }
            break;
        }
        default: {
            info.A.textContent = '';
            info.B.textContent = '';
            info.C.textContent = '';
            info.D.textContent = '';
            info.intersections.textContent = '';
        }
    }
}

function findCircleIntersections(p1, r1, p2, r2) {
    const d = distance(p1, p2);
    if (d > r1 + r2 || d < Math.abs(r1 - r2) || (d === 0 && r1 === r2)) {
        return 'No intersections';
    }

    if (d === r1 + r2 || d === Math.abs(r1 - r2)) {
        // One circle touches another
        const x = p1.x + (p2.x - p1.x) * r1 / (r1 + r2);
        const y = p1.y + (p2.y - p1.y) * r1 / (r1 + r2);
        return [{ x, y }];
    }

    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r1 * r1 - a * a);
    const x2 = p1.x + a * (p2.x - p1.x) / d;
    const y2 = p1.y + a * (p2.y - p1.y) / d;
    const x3 = x2 + h * (p2.y - p1.y) / d;
    const y3 = y2 - h * (p2.x - p1.x) / d;
    const x4 = x2 - h * (p2.y - p1.y) / d;
    const y4 = y2 + h * (p2.x - p1.x) / d;

    return [{ x: x3, y: y3 }, { x: x4, y: y4 }];
}

function updateCanvas() {
    clearCanvas();
    points.forEach(point => drawPoint(point.x, point.y));
    if (points.length >= 2) {
        const [A, B] = points;
        drawCircle(A.x, A.y, distance(A, B), 'blue');
    }
    if (points.length >= 4) {
        const [, , C, D] = points;
        drawCircle(C.x, C.y, distance(C, D), 'yellow');
        updateInfo();
    }
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let point = points.find(p => distance(p, { x, y }) < 5);

    if (point) {
        draggingPoint = point;
    } else if (points.length < 4) {
        points.push({ x, y });
        updateCanvas();
        updateInfo();
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (draggingPoint) {
        const rect = canvas.getBoundingClientRect();
        draggingPoint.x = e.clientX - rect.left;
        draggingPoint.y = e.clientY - rect.top;
        updateCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    draggingPoint = null;
});

document.getElementById('reset').addEventListener('click', () => {
    points = [];
    clearCanvas();
    updateInfo();
});

document.getElementById('about').addEventListener('click', () => {
    modal.style.display = 'block';
});

span.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
