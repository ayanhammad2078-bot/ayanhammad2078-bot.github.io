// AI Math Assistant Widget
// Solves equations and provides step-by-step explanations

class AIMathAssistant {
    constructor() {
        this.chatHistory = [];
        this.isOpen = false;
        this.initWidget();
    }

    initWidget() {
        this.createWidgetHTML();
        this.attachEventListeners();
    }

    createWidgetHTML() {
        const widgetHTML = `
            <div id="ai-math-widget" class="ai-math-widget">
                <div class="ai-math-toggle" id="aiMathToggle">
                    <span class="ai-math-icon">🤖</span>
                    <span class="ai-math-label">Math AI</span>
                </div>
                
                <div class="ai-math-panel" id="aiMathPanel">
                    <div class="ai-math-header">
                        <h3>AI Math Assistant</h3>
                        <button class="ai-math-close" id="aiMathClose">✕</button>
                    </div>
                    
                    <div class="ai-math-chat" id="aiMathChat">
                        <div class="ai-math-message ai-message">
                            <p>Hi! I'm your AI Math Assistant. Paste any equation, and I'll solve it step-by-step and explain how it works.</p>
                            <p style="font-size: 0.85em; margin-top: 8px; opacity: 0.8;">Examples: 2x + 5 = 13, x² - 4 = 0, 3x + 2y = 10</p>
                        </div>
                    </div>
                    
                    <div class="ai-math-input-area">
                        <textarea id="aiMathInput" placeholder="Paste your equation here..." class="ai-math-input"></textarea>
                        <button id="aiMathSolve" class="ai-math-solve-btn">Solve</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        const toggle = document.getElementById('aiMathToggle');
        const closeBtn = document.getElementById('aiMathClose');
        const solveBtn = document.getElementById('aiMathSolve');
        const input = document.getElementById('aiMathInput');

        toggle.addEventListener('click', () => this.togglePanel());
        closeBtn.addEventListener('click', () => this.closePanel());
        solveBtn.addEventListener('click', () => this.solveEquation());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.solveEquation();
        });
    }

    togglePanel() {
        const panel = document.getElementById('aiMathPanel');
        this.isOpen = !this.isOpen;
        panel.style.display = this.isOpen ? 'flex' : 'none';
    }

    closePanel() {
        const panel = document.getElementById('aiMathPanel');
        this.isOpen = false;
        panel.style.display = 'none';
    }

    solveEquation() {
        const input = document.getElementById('aiMathInput');
        const equation = input.value.trim();

        if (!equation) {
            this.addMessage('Please enter an equation.', 'user');
            return;
        }

        this.addMessage(equation, 'user');
        input.value = '';

        // Process the equation
        const solution = this.processEquation(equation);
        this.addMessage(solution, 'ai');
    }

    processEquation(equation) {
        try {
            // Clean the equation
            const cleaned = equation.replace(/\s+/g, '').toLowerCase();

            // Try to parse and solve
            let result = this.solveLinearEquation(cleaned);
            if (result) return result;

            result = this.solveQuadraticEquation(cleaned);
            if (result) return result;

            result = this.solveSimpleExpression(cleaned);
            if (result) return result;

            return this.generateExplanation(
                'I couldn\'t solve this equation. Try formats like:',
                ['2x + 5 = 13', 'x² - 4 = 0', '3x + 2y = 10', '√16 = ?']
            );
        } catch (error) {
            return this.generateExplanation(
                'Error processing equation. Please check the format.',
                ['Make sure to use: x for variable, = for equals, + - * / for operations']
            );
        }
    }

    solveLinearEquation(eq) {
        // Pattern: ax + b = c or similar
        const match = eq.match(/^([+-]?\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*([+-]?\d+\.?\d*)$/);
        if (!match) return null;

        const a = parseFloat(match[1] || '1');
        const b = parseFloat(match[2].replace(/\s+/g, ''));
        const c = parseFloat(match[3]);

        const x = (c - b) / a;

        return this.generateExplanation(
            `Linear Equation: ${match[0]}`,
            [
                `Step 1: Start with ${match[0]}`,
                `Step 2: Subtract ${b} from both sides: ${a}x = ${c} - (${b}) = ${c - b}`,
                `Step 3: Divide both sides by ${a}: x = ${c - b} / ${a}`,
                `Step 4: Simplify: x = ${x.toFixed(4)}`
            ],
            `✓ Solution: x = ${x.toFixed(4)}`
        );
    }

    solveQuadraticEquation(eq) {
        // Pattern: ax² + bx + c = 0
        const match = eq.match(/^([+-]?\d*\.?\d*)\*?x\^?2\s*([+-]\s*\d*\.?\d*)\*?x\s*([+-]\s*\d+\.?\d*)\s*=\s*0$/);
        if (!match) return null;

        const a = parseFloat(match[1] || '1');
        const b = parseFloat(match[2].replace(/\s+/g, ''));
        const c = parseFloat(match[3].replace(/\s+/g, ''));

        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return this.generateExplanation(
                `Quadratic Equation: ${a}x² + ${b}x + ${c} = 0`,
                [
                    `Step 1: Identify coefficients: a = ${a}, b = ${b}, c = ${c}`,
                    `Step 2: Calculate discriminant: b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
                    `Step 3: Since discriminant < 0, there are no real solutions.`,
                    `Step 4: This equation has complex solutions only.`
                ],
                `✗ No real solutions (discriminant = ${discriminant})`
            );
        }

        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        return this.generateExplanation(
            `Quadratic Equation: ${a}x² + ${b}x + ${c} = 0`,
            [
                `Step 1: Identify coefficients: a = ${a}, b = ${b}, c = ${c}`,
                `Step 2: Use quadratic formula: x = (-b ± √(b² - 4ac)) / 2a`,
                `Step 3: Calculate discriminant: b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
                `Step 4: x = (-${b} ± √${discriminant}) / ${2 * a}`,
                `Step 5: x₁ = ${x1.toFixed(4)} and x₂ = ${x2.toFixed(4)}`
            ],
            `✓ Solutions: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`
        );
    }

    solveSimpleExpression(eq) {
        // Try to evaluate simple math expressions
        try {
            // Remove common math notations
            let expr = eq.replace(/√(\d+)/g, (match, num) => Math.sqrt(num));
            expr = expr.replace(/\^/g, '**');

            // Safely evaluate
            if (/^[\d+\-*/().\s√**]+$/.test(expr)) {
                const result = Function('"use strict"; return (' + expr + ')')();
                return this.generateExplanation(
                    `Expression: ${eq}`,
                    [`Step 1: Evaluate ${eq}`, `Step 2: Result = ${result}`],
                    `✓ Answer: ${result}`
                );
            }
        } catch (e) {
            // Silently fail and return null
        }
        return null;
    }

    generateExplanation(title, steps, conclusion = '') {
        let html = `<div class="ai-explanation"><strong>${title}</strong><ul>`;
        steps.forEach(step => {
            html += `<li>${step}</li>`;
        });
        html += '</ul>';
        if (conclusion) {
            html += `<div class="ai-conclusion">${conclusion}</div>`;
        }
        html += '</div>';
        return html;
    }

    addMessage(content, sender) {
        const chatDiv = document.getElementById('aiMathChat');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-math-message ${sender === 'user' ? 'user-message' : 'ai-message'}`;
        messageDiv.innerHTML = `<p>${sender === 'user' ? content : content}</p>`;
        chatDiv.appendChild(messageDiv);
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AIMathAssistant();
});
