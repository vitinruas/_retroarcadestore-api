import {
    IAccountEntitie,
    IAddAccountModel,
} from "../../../account/add-account/add-account-usecase-protocols";

export interface IAddAccountRepository {
    add(newAccountData: IAddAccountModel): Promise<IAccountEntitie>;
}
