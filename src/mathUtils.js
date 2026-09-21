

export function testCalc() {
    return new Promise((resolve) => {
        let clickCount = 0;
        const clicks = [];
        const canvas = document.getElementById('goniometer-canvas');
        const rect = canvas.getBoundingClientRect();

        const handleMouseDown = (event) => {
            const canvasX = event.clientX - rect.left;
            const canvasY = event.clientY - rect.top;
            
            clicks.push({x: canvasX, y: canvasY});
            console.log(`Click ${++clickCount}: X: ${canvasX}, Y: ${canvasY}`);

            if (clicks.length === 2) {
                document.removeEventListener('mousedown', handleMouseDown);
                resolve(clicks);
            }

        };

        document.addEventListener('mousedown', handleMouseDown);
    })
}