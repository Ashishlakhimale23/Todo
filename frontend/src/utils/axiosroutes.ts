import axios, { AxiosError, AxiosRequestConfig } from "axios";

class ConcurrencyHandler {
  queue: { resolve: Function; reject: Function }[];
  isRefreshing: boolean;

  constructor() {
    this.queue = [];
    this.isRefreshing = false;
  }

  execute(refreshTokenFunction: () => Promise<any>) {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });

      if (!this.isRefreshing) {
        this.isRefreshing = true;

        refreshTokenFunction()
          .then((token) => {
            this.queue.forEach((promise) => promise.resolve(token));
            this.queue = [];
            this.isRefreshing = false;
          })
          .catch((err) => {
            this.queue.forEach((promise) => promise.reject(err));
            this.queue = [];
            this.isRefreshing = false;
          });
      }
    });
  }
}
const concurrencyHandler = new ConcurrencyHandler()
export const api = axios.create({
    baseURL:process.env.BASE_URL
})


const refreshTokenFunction=async()=>{
                 const refreshtoken = localStorage.getItem("refreshtoken")
               
                    const response = await api.post(`/user/refresh`,{refreshtoken:refreshtoken})
                    const newauthtoken = response.data.authtoken
                    const newrefreshtoken = response.data.refreshtoken
                    localStorage.setItem("authtoken",newauthtoken)
                    localStorage.setItem("refreshtoken",newrefreshtoken)
                    return newauthtoken
}
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
api.interceptors.response.use(
    response => response,
    async function (error : AxiosError) {
        const originalrequest = error.config as ExtendedAxiosRequestConfig

        console.log(originalrequest)

                if(error.response?.status == 403 && originalrequest?.url == '/user/refresh'){
            setTimeout(() => {
               window.location.href = '/login' 
            }, 500);
            return Promise.reject(error)
        }
        
                if(error.response?.status == 401 && !originalrequest._retry){
                  console.log("errror")

                    originalrequest._retry = true 
            try{
                    const newauthtoken = concurrencyHandler.execute(refreshTokenFunction) 
                    api.defaults.headers.common["Authorization"] = `Bearer ${newauthtoken}`
                    return api(originalrequest)

            }catch(err){
setTimeout(() => {
               window.location.href = '/login' 
            }, 500);
            return Promise.reject(error)
            
        }

                }

                    return Promise.reject(error)


    }
)