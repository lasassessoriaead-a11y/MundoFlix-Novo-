(() => {
  const endpoint = 'https://bununfufuvekzkmveeoo.supabase.co/functions/v1/public-config';
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint, false);
    xhr.send(null);
    if (xhr.status < 200 || xhr.status >= 300) throw new Error('Falha ao carregar configuração pública.');
    const cfg = JSON.parse(xhr.responseText);
    if (!cfg.supabaseUrl || !cfg.supabaseKey) throw new Error('Configuração pública incompleta.');
    window.MUNDO_FLIX_CONFIG = Object.freeze(cfg);
  } catch (error) {
    console.error('Mundo Flix: configuração indisponível.');
    window.MUNDO_FLIX_CONFIG = Object.freeze({ supabaseUrl: '', supabaseKey: '' });
  }

  window.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.querySelector('.loginbox');
    const signup = loginBox?.querySelector('button[onclick="signUp()"]');
    if (loginBox && signup && !document.getElementById('forgotPasswordLink')) {
      const link = document.createElement('a');
      link.id = 'forgotPasswordLink';
      link.href = 'reset-password.html';
      link.textContent = 'Esqueci minha senha';
      link.style.display = 'block';
      link.style.textAlign = 'center';
      link.style.marginTop = '12px';
      link.style.color = '#f97316';
      link.style.fontWeight = '700';
      link.style.textDecoration = 'none';
      signup.insertAdjacentElement('afterend', link);
    }
  });
})();
