from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from models import AccountIn, AccountOut, AccountForm, HttpError, AccountToken
from queries.accounts import AccountQueries, DuplicateAccountError
from authenticator import authenticator

router = APIRouter()

@router.post('/api/accounts', response_model=AccountToken | HttpError)
async def create_account(
    info: AccountIn,
    request: Request,
    response: Response,
    queries: AccountQueries = Depends()
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = queries.create(account_in=info, hashed_password=hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create account with those credentials"
        )
    form = AccountForm(username=info.username, password=info.password)
    token = await authenticator.login(response, request, form, queries)
    return AccountToken(account=account, **token.dict())