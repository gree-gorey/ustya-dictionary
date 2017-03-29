function handleChange(cb) {
    document.getElementById(cb.getAttribute("what-to-disable")).disabled = !cb.checked;
}