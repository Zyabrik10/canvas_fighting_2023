export function hideUserInterFace(){
    document.querySelector(".user-ui").classList.add("hidden");
    document.querySelector(".health-timer-box").classList.remove("hidden");
}

export function showUserInterFace(){
    document.querySelector(".user-ui").classList.remove("hidden");
    document.querySelector(".health-timer-box").classList.add("hidden");
}