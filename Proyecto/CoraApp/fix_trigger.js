const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres:Porras0186!*@db.gptwalvbuqinkjcvuqql.supabase.co:5432/postgres'
});

const sql = 
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS \$\$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    (new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name'),
    COALESCE(new.raw_user_meta_data->>'role', 'patient')::user_role
  );
  RETURN new;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;
;

client.connect()
  .then(() => client.query(sql))
  .then(() => {
    console.log('Trigger fixed successfully!');
    return client.query('DELETE FROM auth.users WHERE email LIKE \'%example.com\''); // clean up test users
  })
  .then(() => client.end())
  .catch(err => {
    console.error('Error fixing db:', err);
    client.end();
  });
