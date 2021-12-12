import { makeAutoObservable, runInAction } from "mobx";
import AuthService, { ACSUser } from "../services/AuthService";

class AuthManager {
  user: ACSUser | undefined = undefined;
  isLoading: boolean = false;
  error: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  makeRequest = () => {
    this.error = '';
    this.isLoading = true;
  };

  completeRequest = (errorMessage?: string): boolean => {
    this.error = errorMessage ?? '';
    this.isLoading = false;
    return !errorMessage || errorMessage === ''; // returns true if no error, false otherwise
  };

  authenticateUser = async () => {
    try {
      this.makeRequest();
      const fetchedUser = await AuthService.fetchUserInfo();
      console.log('Fetched user!', fetchedUser);
      runInAction(() => {
        this.user = fetchedUser;
      });
      this.completeRequest();
    } catch (error) {
      console.log("Error authenticating user!", error);
      this.completeRequest("Error authenticating user!");
    }
  }

  clearError = () => {
      this.error = undefined;
  }

  deauthenticateUser = () => {
      this.user = undefined;
  }
}

const authManager = new AuthManager();
export default authManager;
