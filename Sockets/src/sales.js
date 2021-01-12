import algaehMysql from "algaeh-mysql";
import { createNotification } from "./utils";
export default function sales(sockets) {
  const _mysql = new algaehMysql();
  socket.on("sales_order_auth", async (data) => {
    try {
      const result = await _mysql.executeQuery({
        query: `SELECT 
                      MR.role_id, AU.employee_id, AU.user_display_name
                  FROM
                      algaeh_m_module_role_privilage_mapping MR
                         INNER JOIN
                      algaeh_m_screen_role_privilage_mapping SR ON SR.module_role_map_id = MR.algaeh_m_module_role_privilage_mapping_id
                         INNER JOIN
                      algaeh_m_role_user_mappings RU ON MR.role_id = RU.role_id
                         INNER JOIN
                      algaeh_d_app_user AU ON AU.algaeh_d_app_user_id = RU.user_id
                  WHERE
                  module_code = 'SALES' AND SR.screen_code = 'SAL002'
                          AND MR.role_id NOT IN (SELECT 
                              MR.role_id
                          FROM
                              algaeh_m_module_role_privilage_mapping MR
                                 INNER JOIN
                              algaeh_m_screen_role_privilage_mapping SR ON SR.module_role_map_id = MR.algaeh_m_module_role_privilage_mapping_id
                                 INNER JOIN
                              algaeh_m_component_screen_privilage_mapping SRM ON SRM.algaeh_m_screen_role_privilage_mapping_id = SR.algaeh_m_screen_role_privilage_mapping_id
                                  INNER JOIN
                              algaeh_d_app_component CO ON SRM.component_id = CO.algaeh_d_app_component_id
                          WHERE
                              component_code = 'SALE_LST_AUTH1');`,
      });
      _mysql.releaseConnection();
      const authIds = result.map((item) => item.employee_id);
      const msg = `Sales ${data.sales_order_number} is waiting from Level 1 authorization`;
      const promises = await Promise.all(
        authIds.map((id) =>
          createNotification({
            message: msg,
            user_id: id,
            title: "Sales Order",
          })
        )
      );
      authIds.forEach((id, index) => {
        socket.to(`${id}`).emit("notification", promises[index]);
      });
    } catch (e) {
      console.error(e);
    }
  });
  socket.on("sales_order_auth_level_one", async (data) => {
    try {
      const result = await _mysql.executeQuery({
        query: `SELECT 
                      MR.role_id, AU.employee_id, AU.user_display_name
                  FROM
                      algaeh_m_module_role_privilage_mapping MR
                         INNER JOIN
                      algaeh_m_screen_role_privilage_mapping SR ON SR.module_role_map_id = MR.algaeh_m_module_role_privilage_mapping_id
                         INNER JOIN
                      algaeh_m_role_user_mappings RU ON MR.role_id = RU.role_id
                         INNER JOIN
                      algaeh_d_app_user AU ON AU.algaeh_d_app_user_id = RU.user_id
                  WHERE
                  module_code = 'SALES' AND SR.screen_code = 'SAL002'
                          AND MR.role_id NOT IN (SELECT 
                              MR.role_id
                          FROM
                              algaeh_m_module_role_privilage_mapping MR
                                 INNER JOIN
                              algaeh_m_screen_role_privilage_mapping SR ON SR.module_role_map_id = MR.algaeh_m_module_role_privilage_mapping_id
                                 INNER JOIN
                              algaeh_m_component_screen_privilage_mapping SRM ON SRM.algaeh_m_screen_role_privilage_mapping_id = SR.algaeh_m_screen_role_privilage_mapping_id
                                  INNER JOIN
                              algaeh_d_app_component CO ON SRM.component_id = CO.algaeh_d_app_component_id
                          WHERE
                              component_code = 'SALE_LST_AUTH2');`,
      });
      _mysql.releaseConnection();
      const authIds = result.map((item) => item.employee_id);
      const msg = `Sales ${data.sales_order_number} is waiting from Level 2 authorization`;
      const promises = await Promise.all(
        authIds.map((id) =>
          createNotification({
            message: msg,
            user_id: id,
            title: "Sales Order",
          })
        )
      );
      authIds.forEach((id, index) => {
        socket.to(`${id}`).emit("notification", promises[index]);
      });
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("sales_order_auth_level_two", async (data, id) => {
    try {
      if (typeof id === "number") {
        const emp = await _mysql.executeQuery({
          query: `SELECT employee_id FROM algaeh_d_app_user where algaeh_d_app_user_id=?`,
          values: [id],
          printQuery: true,
        });
        console.log(emp);
        if (emp) {
          const msg = `Your Sales ${data.purchase_number} is authorized by level 2`;
          const save = await createNotification({
            message: msg,
            user_id: emp[0].employee_id,
            title: "Sales Order",
          });
          socket.to(`${emp[0].employee_id}`).emit("notification", save);
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
}
