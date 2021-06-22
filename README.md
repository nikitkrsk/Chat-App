# To start project
```bash
git clone project
npm i 
npm run start
``` 
## To clear Dbs
```bash
sudo -u postgres psql somedatabase
DROP TABLE chat_user, "group", group_users_chat_user, session, message, migrations, role, status CASCADE;
```


# To Create Migration in TYPORM

```bash
npm run typeorm:cli -- migration:create -n MigrationName
npm run typeorm:cli -- migration:create -n Admins

```

# POSTGRES INSTALLATION

```bash
sudo apt install postgresql postgresql-contrib

sudo -u postgres createuser <username>
sudo -u postgres createuser newuser

sudo -u postgres createdb <dbname>
sudo -u postgres createdb somedatabase

sudo -u postgres psql
alter user <username> with encrypted password '<password>';
alter user newuser with encrypted password 'secret123';
ALTER ROLE <username> SUPERUSER;
ALTER ROLE newuser SUPERUSER;

ALTER USER user_name WITH PASSWORD 'new_password';
ALTER USER newuser WITH PASSWORD 'secret123';
```

# Useful links
[Sokcets emit cheatsheet](https://socket.io/docs/v4/emit-cheatsheet/)
[FE Example](https://github.com/nikitkrsk/Chat-App-FE)

