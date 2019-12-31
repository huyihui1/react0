create table ca_progress (id integer auto_increment primary key, head varchar(3), isp varchar(8), progress integer default 0);
create table ca_progress_error (id integer auto_increment primary key, num varchar(7), isp varchar(8), code integer, msg varchar(255), created_at datetime);

create table ct_progress (id integer auto_increment primary key, city varchar(255), yys varchar(8), progress integer default 0);