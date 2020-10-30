select
  id
from 
  airq.owners 
where 
  email = ${email} and
  crypt(${password}, salt) = password