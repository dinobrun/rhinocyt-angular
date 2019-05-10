import { isDevMode, Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';

import { Doctor } from '../interfaces/api-models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * The key of the authentication token.
   */
  private static readonly KEY_AUTH_TOKEN: string = 'AUTH_TOKEN';

  /**
   * The regex structure of a token.
   */
  private static readonly REGEX_TOKEN: RegExp = /(\d|\w){40}/;

  /**
   * The generic auth subject, that is the generic event
   * emitter.
   */
  private authSubject: Subject<AuthEvent> = new Subject<AuthEvent>();

  /**
   * The specific login subject.
   */
  private loginObservable: Observable<AuthEvent> = this.authSubject
                                                       .pipe(filter((event: AuthEvent) => event instanceof LoginEvent));

  /**
   * The specific signup subject.
   */
  private signupObservable: Observable<AuthEvent> = this.authSubject
                                                        .pipe(filter((event: AuthEvent) => event instanceof SignupEvent));

  /**
   * The specific logout subject.
   */
  private logoutObservable: Observable<AuthEvent> = this.authSubject
                                                        .pipe(filter((event: AuthEvent) => event instanceof LogoutEvent));

  /**
   * The fetch data subject.
   */
  private fetchDataObservable: Observable<AuthEvent> = this.authSubject
                                                           .pipe(filter((event: AuthEvent) => event instanceof FetchDataEvent));

  /**
   * The logged-in doctor.
   */
  private doctor: Doctor;

  constructor(private cookieService: CookieService) { }

  /**
   * Check whether a token is valid or not.
   * @param  token The token to check.
   * @return       The validity of the token.
   */
  private isTokenValid(token: string): boolean {
    return AuthService.REGEX_TOKEN.test(token);
  }

  /**
   * Returns the logged user's auth token.
   */
  public getToken(): string {
    return this.cookieService.get(AuthService.KEY_AUTH_TOKEN);
  }

  /**
   * Returns the logged doctor.
   */
  public getDoctor(): Doctor {
    return this.doctor;
  }

  /**
   * Sets the logged doctor.
   * @param doctor The doctor.
   */
  public setDoctor(doctor: Doctor) {
    this.doctor = doctor;
    this.authSubject.next(new FetchDataEvent());
  }

  /**
   * Check whether the user is logged-in or not.
   * @return The state of login of the user.
   */
  public isLogged(): boolean {
    return this.cookieService.check(AuthService.KEY_AUTH_TOKEN);
  }

  /**
   * Signup a new user from a given data.
   * @param doctor The user data.
   */
  public signup(doctor: Doctor) {
    this.authSubject.next(new SignupEvent());
  }

  /**
   * Login a user storing its authentication token.
   * @param token The authentication token.
   */
  public login(loginData: {doctor: Doctor, token: string}) {
    if (!this.isTokenValid(loginData.token)) {
      throw new Error('Token is not valid.');
    }

    if (isDevMode()) {
      console.log('Successfully logged-in.');
      console.log('Doctor: ', loginData.doctor);
    }

    this.cookieService.set(AuthService.KEY_AUTH_TOKEN, loginData.token);
    this.doctor = loginData.doctor;
    this.authSubject.next(new LoginEvent());
  }

  /**
   * User's logout.
   */
  public logout() {
    if (isDevMode()) {
      console.log('Successfully logged-out.');
    }

    this.cookieService.delete(AuthService.KEY_AUTH_TOKEN);
    delete this.doctor;

    this.authSubject.next(new LogoutEvent());
  }

  /**
   * Returns the generic auth event observable.
   */
  public onEvent(): Observable<AuthEvent> {
    return this.authSubject.asObservable();
  }

  /**
   * Returns the specific auth event observable of type login.
   */
  public onLogin(): Observable<LoginEvent> {
    return this.loginObservable;
  }

  /**
   * Returns the specific auth event observable of type signup.
   */
  public onSignup(): Observable<SignupEvent> {
    return this.signupObservable;
  }

  /**
   * Returns the specific auth event observable of type logout.
   */
  public onLogout(): Observable<LogoutEvent> {
    return this.logoutObservable;
  }

  public onFetchData(): Observable<FetchDataEvent> {
    return this.fetchDataObservable;
  }
}


/**
 * The generic authentication event.
 */
export abstract class AuthEvent {
  constructor(public type: 'login' | 'signup' | 'logout' | 'fetchData') {}
}


/**
 * The specific login event.
 */
export class LoginEvent extends AuthEvent {
  constructor() {
    super('login');
  }
}


/**
 * The specific signup event.
 */
export class SignupEvent extends AuthEvent {
  constructor() {
    super('signup');
  }
}


/**
 * The specific logout event.
 */
export class LogoutEvent extends AuthEvent {
  constructor() {
    super('logout');
  }
}

/**
 * The fetch data event
 */
export class FetchDataEvent extends AuthEvent {
  constructor() {
    super('fetchData');
  }
}
