import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable() 

export class AuthService implements CanActivate {

    constructor(private http: HttpClient, private router: Router) {}

    private token = ''

    login(user_id, password) : Promise<boolean> {
        //reset the token
        this.token = ''
        //Write a call to the backend
        //Examine status code
        return this.http.post <any> ('http://localhost:3000/login', {user_id, password}, {observe: "response"}).toPromise()
            .then(resp => { 
                
                console.log(resp)
                if(resp.status == 200){
                    this.token = resp.body.token
                    return true 
                }
            
            })
            .catch(err => { 
                console.error(err); 
                if(err.status == 401){
                    return false 
                }
            })
    }

    isLogin() {

        return this.token != ''
        //if token = '', return false, if token != '' return true
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.isLogin()){
            return true
        }
        return this.router.parseUrl('/error')
    }

}