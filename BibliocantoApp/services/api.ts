import axios from "axios";

const api = axios.create({
    baseURL: "https://bibliocantobackend-ejdcdghpamcydde8.brazilsouth-01.azurewebsites.net/",
});

export default api;
