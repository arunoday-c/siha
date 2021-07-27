import React from "react";
import { List, Avatar, Badge, Input, Checkbox } from "algaeh-react-components";

export default React.memo(function BatchValidationList(props) {
  const { batch_list } = props;
  return (
    <div className="col-4">
      <div className="col-12">
        <Input.Group compact>
          <Checkbox style={{ width: "10%", padding: 10 }}></Checkbox>
          <Input.Search style={{ width: "90%" }} defaultValue="" />
        </Input.Group>
      </div>
      <div className="col-12">
        <List
          itemLayout="vertical"
          size="small"
          style={{ backgroundColor: "white", lineHeight: 0 }}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
            showQuickJumper: false,
          }}
          dataSource={batch_list}
          renderItem={(item) => (
            <List.Item
              key={item.primary_id_no}
              actions={[<Badge text="Negative" color="green" />]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar>
                    {String(item.full_name).substring(0, 2).toUpperCase()}
                  </Avatar>
                }
                title={item.full_name}
                description={item.test_name}
              />
              <ul style={{ listStyle: "none", display: "inline-flex" }}>
                <li>{item.primary_id_no}</li>
                <li>{item.lab_id_number}</li>
                <li>{item.specimen_name}</li>
              </ul>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
});
