// Componente de Quantum Academy
class AcademyComponent {
    static async loadAcademyTab() {
        const mainContent = document.getElementById('mainContent');
        
        mainContent.innerHTML = `
            <div class="tab-content active" id="academy-tab">
                <div class="academy-hero">
                    <h2>Quantum Academy</h2>
                    <p>Aprende a invertir como un profesional con nuestro método exclusivo</p>
                </div>
                
                <div class="section-title">
                    <span>Método Quantum</span>
                </div>
                
                <div class="academy-module">
                    <div class="academy-module-header">
                        <div class="academy-module-icon">
                            <i class="fas fa-atom"></i>
                        </div>
                        <div class="academy-module-title">El Enfoque Quantum</div>
                    </div>
                    <div class="academy-module-content">
                        <p>Nuestro método combina análisis técnico, fundamental y sentimiento del mercado para identificar oportunidades de inversión con alto potencial de rentabilidad.</p>
                        <p>Basado en 3 pilares fundamentales: <strong>Momentum</strong>, <strong>Valor</strong> y <strong>Sentimiento</strong>, aplicados a través de algoritmos propietarios que analizan millones de puntos de datos en tiempo real.</p>
                    </div>
                </div>
                
                <div class="section-title">
                    <span>Lo que Aprenderás</span>
                </div>
                
                <div class="module-grid">
                    <div class="module-card">
                        <div class="module-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="module-name">Análisis Técnico</div>
                        <div class="module-desc">Domina gráficos e indicadores</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 65%"></div>
                        </div>
                    </div>
                    
                    <div class="module-card">
                        <div class="module-icon">
                            <i class="fas fa-balance-scale"></i>
                        </div>
                        <div class="module-name">Gestión de Riesgo</div>
                        <div class="module-desc">Protege y haz crecer tu capital</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 40%"></div>
                        </div>
                    </div>
                    
                    <div class="module-card">
                        <div class="module-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <div class="module-name">Psicología</div>
                        <div class="module-desc">Mentalidad del trader exitoso</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 30%"></div>
                        </div>
                    </div>
                    
                    <div class="module-card">
                        <div class="module-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="module-name">Automatización</div>
                        <div class="module-desc">Estrategias algorítmicas</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 20%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="section-title">
                    <span>Videos Educativos</span>
                </div>
                
                <div class="academy-module">
                    <div class="academy-module-header">
                        <div class="academy-module-icon">
                            <i class="fas fa-play-circle"></i>
                        </div>
                        <div class="academy-module-title">Introducción al Trading</div>
                    </div>
                    <div class="academy-module-content">
                        <p>Accede a nuestra biblioteca de videos educativos con lecciones paso a paso, análisis de mercado en tiempo real y entrevistas con traders profesionales.</p>
                        
                        <div class="video-container">
                            <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#1a1a1a; color:white;">
                                <div style="text-align:center;">
                                    <i class="fas fa-play-circle" style="font-size:48px; margin-bottom:10px;"></i>
                                    <p>Video: Estrategias de Entrada y Salida</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}