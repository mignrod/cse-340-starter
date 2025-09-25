document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.toggle');
  const input = document.querySelector('#password');
  if (toggle && input) {
    toggle.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        toggle.src = '/images/site/eye.svg'; // Cambia a ojo abierto
        toggle.alt = 'Hide password';
      } else {
        input.type = 'password';
        toggle.src = '/images/site/eye-slash.svg'; // Cambia a ojo cerrado
        toggle.alt = 'Show password';
      }
    });
  }
});
