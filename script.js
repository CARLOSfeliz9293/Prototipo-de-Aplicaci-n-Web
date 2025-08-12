// JavaScript principal para el prototipo de aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Prototipo de aplicación cargado');
    
    // Inicializar todos los componentes interactivos
    initializePasswordToggle();
    initializeFormValidation();
    initializeTooltips();
    initializeAnimations();
    initializeThemeToggle();
    
    // Mostrar estados de carga en envíos de formularios
    handleFormSubmissions();
    
    // Inicializar características del panel de control si estamos en esa página
    if (document.getElementById('actionModal')) {
        initializeDashboard();
    }
});

/**
 * Inicializar funcionalidad de mostrar/ocultar contraseña
 */
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('#togglePassword, #toggleConfirmPassword');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id === 'togglePassword' ? 'password' : 'confirm_password';
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Inicializar validación mejorada de formularios
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    });
}

/**
 * Validar campo individual del formulario
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remover clases de validación previas
    field.classList.remove('is-valid', 'is-invalid');
    
    // Verificar si el campo es requerido y está vacío
    if (required && !value) {
        field.classList.add('is-invalid');
        return false;
    }
    
    // Validación específica por tipo
    switch (type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                field.classList.add('is-invalid');
                return false;
            }
            break;
            
        case 'password':
            if (value && value.length < 8) {
                field.classList.add('is-invalid');
                return false;
            }
            break;
    }
    
    // Si llegamos aquí, el campo es válido
    if (value) {
        field.classList.add('is-valid');
    }
    return true;
}

/**
 * Función auxiliar para validación de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Inicializar tooltips de Bootstrap
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Inicializar animaciones de página
 */
function initializeAnimations() {
    // Agregar animación fade-in al contenido principal
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    
    // Agregar animación slide-in a las tarjetas con retraso
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
}

/**
 * Manejar estados de carga en envíos de formularios
 */
function handleFormSubmissions() {
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    
    submitButtons.forEach(button => {
        const form = button.closest('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); // Prevenir envío real para el prototipo
                
                // Validar formulario
                const isValid = validateForm(form);
                
                if (isValid) {
                    // Agregar estado de carga al botón
                    button.classList.add('loading');
                    button.disabled = true;
                    
                    // Guardar texto original
                    const originalText = button.textContent;
                    button.textContent = 'Procesando...';
                    
                    // Simular procesamiento
                    setTimeout(() => {
                        button.classList.remove('loading');
                        button.disabled = false;
                        button.textContent = originalText;
                        
                        // Mostrar mensaje de éxito y redirigir si es login/registro
                        if (form.id === 'loginForm') {
                            showNotification('¡Inicio de sesión exitoso!', 'success');
                            setTimeout(() => {
                                window.location.href = 'dashboard.html';
                            }, 1500);
                        } else if (form.id === 'registerForm') {
                            showNotification('¡Registro exitoso! Redirigiendo al inicio de sesión...', 'success');
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1500);
                        } else {
                            showNotification('¡Acción completada con éxito!', 'success');
                        }
                    }, 2000);
                } else {
                    showNotification('Por favor corrija los errores en el formulario', 'error');
                }
            });
        }
    });
}

/**
 * Validar formulario completo
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Validación especial para confirmación de contraseña
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirm_password');
    
    if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Inicializar funcionalidad de cambio de tema
 */
function initializeThemeToggle() {
    // Placeholder para futura funcionalidad de cambio de tema
    // La aplicación actualmente usa el tema oscuro por defecto
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', theme);
}

/**
 * Inicializar funcionalidad específica del panel de control
 */
function initializeDashboard() {
    // Animar tarjetas de estadísticas al cargar la página
    animateStatsCards();
    
    // Inicializar funcionalidad de actualización
    initializeRefreshButtons();
    
    // Inicializar animaciones de barras de progreso
    animateProgressBars();
}

/**
 * Animar tarjetas de estadísticas con efecto de conteo
 */
function animateStatsCards() {
    const statCards = document.querySelectorAll('[data-counter]');
    
    statCards.forEach(card => {
        const finalValue = parseInt(card.getAttribute('data-counter'));
        if (!isNaN(finalValue)) {
            animateCounter(card, 0, finalValue, 1500);
        }
    });
}

/**
 * Animar contador desde valor inicial hasta valor final
 */
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        const currentValue = Math.floor(start + (end - start) * progress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Inicializar funcionalidad de botones de actualización
 */
function initializeRefreshButtons() {
    const refreshButton = document.getElementById('refreshActivity');
    
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            const icon = this.querySelector('.fa-sync-alt');
            icon.classList.add('refresh-loading');
            
            setTimeout(() => {
                icon.classList.remove('refresh-loading');
                showNotification('Actividad actualizada', 'info');
            }, 1000);
        });
    }
}

/**
 * Animar barras de progreso
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar[data-width]');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });
}

/**
 * Mostrar notificaciones
 */
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show notification`;
    
    const iconClass = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-triangle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    }[type] || 'fa-info-circle';
    
    alertDiv.innerHTML = `
        <i class="fas ${iconClass} me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remover automáticamente después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * Mostrar modal (para funcionalidad del panel de control)
 */
function showModal(action) {
    const modal = document.getElementById('actionModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modal && modalTitle && modalBody) {
        const actions = {
            'createProject': {
                title: 'Crear Nuevo Proyecto',
                body: `
                    <form>
                        <div class="mb-3">
                            <label for="projectName" class="form-label">Nombre del Proyecto</label>
                            <input type="text" class="form-control" id="projectName" placeholder="Ingrese el nombre del proyecto">
                        </div>
                        <div class="mb-3">
                            <label for="projectDescription" class="form-label">Descripción</label>
                            <textarea class="form-control" id="projectDescription" rows="3" placeholder="Describa el proyecto"></textarea>
                        </div>
                    </form>
                `
            },
            'inviteUser': {
                title: 'Invitar Miembro del Equipo',
                body: `
                    <form>
                        <div class="mb-3">
                            <label for="userEmail" class="form-label">Correo Electrónico</label>
                            <input type="email" class="form-control" id="userEmail" placeholder="ejemplo@correo.com">
                        </div>
                        <div class="mb-3">
                            <label for="userRole" class="form-label">Rol</label>
                            <select class="form-control" id="userRole">
                                <option>Desarrollador</option>
                                <option>Diseñador</option>
                                <option>Gerente de Proyecto</option>
                            </select>
                        </div>
                    </form>
                `
            },
            'generateReport': {
                title: 'Generar Reporte',
                body: `
                    <form>
                        <div class="mb-3">
                            <label for="reportType" class="form-label">Tipo de Reporte</label>
                            <select class="form-control" id="reportType">
                                <option>Reporte de Progreso</option>
                                <option>Reporte de Tiempo</option>
                                <option>Reporte de Actividad</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="dateRange" class="form-label">Rango de Fechas</label>
                            <input type="text" class="form-control" id="dateRange" placeholder="Últimos 30 días">
                        </div>
                    </form>
                `
            }
        };
        
        const actionData = actions[action] || actions['createProject'];
        modalTitle.textContent = actionData.title;
        modalBody.innerHTML = actionData.body;
        
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }
}

/**
 * Función utilitaria para hacer peticiones AJAX (para uso futuro)
 */
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        
        if (method === 'POST' && data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    resolve(xhr.responseText);
                }
            } else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Error de red'));
        };
        
        xhr.send(data ? JSON.stringify(data) : null);
    });
}

/**
 * Soporte para navegación por teclado
 */
document.addEventListener('keydown', function(e) {
    // Tecla ESC cierra modales
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            const modalInstance = bootstrap.Modal.getInstance(openModal);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    }
    
    // Tecla Enter envía formularios cuando se enfoca en botón de envío
    if (e.key === 'Enter' && e.target.type === 'submit') {
        e.target.click();
    }
});

/**
 * Manejar eventos de redimensionamiento de ventana
 */
window.addEventListener('resize', function() {
    // Recalcular elementos responsivos si es necesario
    const tables = document.querySelectorAll('.table-responsive');
    tables.forEach(table => {
        // Forzar reflow para tablas responsivas
        table.style.overflow = 'auto';
    });
});

/**
 * Manejo de errores para errores no capturados
 */
window.addEventListener('error', function(e) {
    console.error('Error de JavaScript:', e.error);
    showNotification('Ocurrió un error inesperado. Por favor recargue la página.', 'error');
});

// Exportar funciones para uso en otros scripts
window.PrototipoApp = {
    showNotification,
    makeRequest,
    validateField,
    animateCounter,
    showModal
};

// Validación en tiempo real para confirmación de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const confirmPasswordInput = document.getElementById('confirm_password');
    const passwordInput = document.getElementById('password');
    
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else if (confirmPassword) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }
});
