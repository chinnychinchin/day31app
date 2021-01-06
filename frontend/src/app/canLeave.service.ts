import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router'

export interface CanLeaveRoute {

    canLeave() : boolean | Promise<boolean>

}



@Injectable() 
export class CanLeaveService implements CanDeactivate<CanLeaveRoute> {

    canDeactivate(com: CanLeaveRoute, currRoute: ActivatedRouteSnapshot, currState: RouterStateSnapshot, nextState:RouterStateSnapshot)
    {

        if(!com.canLeave()) {
            return confirm('Are you sure you wish to leave?')
        }
        return true

    }
}