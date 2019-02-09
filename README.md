# hims-app

#hardcoded database tables
hims_d_service_type,
hims_d_vitals_header

# Howto create (ADMIN or SUPER ADMIN)

to create ADMIN or SUPER ADMIN go to database
add flags in 3 tables Manually

1. algaeh_d_app_user; --> Field: user_type(AD,SU)
2. algaeh_d_app_group;-->Field:group_type(AD,SU)
3. algaeh_d_app_roles;-->Field:role_type(AD,SU)

# Link the modules

1. billing module -->sudo npm link Use in front desk
