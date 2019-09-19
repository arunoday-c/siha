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

#default Linking

1. algaeh key ===> sudo npm link
2. algaeh utilities ===> sudo npm link ===> npm link algaeh-keys

# Link the modules

1. billing module ===> sudo npm link Use in front desk and pharmacy
2. Laboratory module ===> sudo npm link Use in billing
3. Radiology module ===> sudo npm link Use in billing

# pharmacy item expiry notification EVENT-TRIGGER

SET GLOBAL event_scheduler = ON;
CREATE EVENT IF NOT EXISTS pharmacy_item_expiry_notify
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE) + INTERVAL 1 DAY + INTERVAL 1 HOUR
ON COMPLETION PRESERVE
DO call hims_test_db.pharmacy_item_expiry_notify();
