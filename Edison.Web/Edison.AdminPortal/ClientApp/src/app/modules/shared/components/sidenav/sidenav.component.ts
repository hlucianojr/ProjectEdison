import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, NavigationStart } from '@angular/router'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../reducers'
import { SetPageData } from '../../../../reducers/app/app.actions'
import { Subscription } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { ShowManageResponse, ShowSelectingLocation } from '../../../../reducers/response/response.actions';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: [ './sidenav.component.scss' ],
})
export class SidenavComponent implements OnInit, OnDestroy {
    public navLinks = []
    public activeRoute: string

    private pathSub$: Subscription

    constructor (private router: Router, private store: Store<AppState>) { }

    ngOnInit() {
        this.setupNavLinks()
        this.pathSub$ = this.router.events
            .pipe(
                filter(event => event instanceof NavigationStart),
                map((event: NavigationStart) => event.url)
            )
            .subscribe(path => {
                this.activeRoute = path
            })
    }

    ngOnDestroy() {
        this.pathSub$.unsubscribe()
    }

    private setupNavLinks() {
        this.navLinks = [
            {
                title: 'Right Now',
                route: '/dashboard',
                sidebar: true,
                icon: 'app-icon now',
                onClick: this.activateNavLink,
            },
            {
                title: 'Devices',
                route: '/dashboard/devices',
                sidebar: false,
                icon: 'app-icon sensors',
                onClick: this.activateNavLink,
            },
            {
                title: 'Messaging',
                route: '/dashboard/messaging',
                sidebar: true,
                icon: 'app-icon chat',
                onClick: this.activateNavLink,
            },
            {
                title: 'Action Screen',
                route: '/actions',
                sidebar: false,
                icon: 'app-icon history',
                onClick: this.activateNavLink,
            },
            {
                title: 'Configuration',
                route: '/configuration',
                sidebar: false,
                icon: 'app-icon gear',
                onClick: this.activateNavLink,
            },
        ]
    }

    private activateNavLink = activeNavLink => {
        this.navLinks = this.navLinks.map(nl => ({
            ...nl,
            active: nl.title === activeNavLink.title,
        }))
        if (activeNavLink.rootRoute) {
            this.router.navigate([ activeNavLink.rootRoute, activeNavLink.route ]);
        } else {
            this.router.navigate([ activeNavLink.route ]);
        }
        this.store.dispatch(new ShowManageResponse({ showManageResponse: false }));
        this.store.dispatch(new ShowSelectingLocation({ showSelectingLocation: false }));
    }
}