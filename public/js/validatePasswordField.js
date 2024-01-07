function validateForm() {
    let password = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      document.getElementById("passwordMismatch").style.display = "block";
      return false;
    } else {
      document.getElementById("passwordMismatch").style.display = "none";
      return true;
    }
}