document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.toggle');
  const input = document.querySelector('#password');
  if (toggle && input) {
    toggle.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.replace('uil-eye-slash', 'uil-eye');
      } else {
        input.type = 'password';
        toggle.classList.replace('uil-eye', 'uil-eye-slash');
      }
    });
  }
});
