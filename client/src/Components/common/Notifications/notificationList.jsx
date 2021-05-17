import React, { useEffect, useState } from "react";
import {
  List,
  Button,
  Empty,
  Skeleton,
  Avatar,
  Spin,
  AlgaehMessagePop,
} from "algaeh-react-components";
import newAlgaehApi from "../../../hooks/newAlgaehApi";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
// import { MainContext } from "algaeh-react-components";
import moment from "moment";
export default function NotificationList({
  isToday,
  userToken,
  socket,
  count,
}) {
  const history = useHistory();
  //   const { userToken } = useContext(MainContext);
  const [perPage, setPageSize] = useState(10); //, setPerPage, setPage, setDate
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    setFirstLoad(true);
  }, []);
  useEffect(() => {
    if (page === 0) {
      callNotifications({ require_total_count: true });
    } else {
      callNotifications({ require_total_count: false });
    }
  }, [page, perPage, count]);

  async function callNotifications({ require_total_count }) {
    try {
      setLoading(true);
      const result = await newAlgaehApi({
        uri: "/getAllNotifications",
        module: "documentManagement",
        method: "GET",
        data: {
          user_id: userToken.employee_id,
          require_total_count,
          perPage,
          page,
          todays: isToday,
        },
      }).catch((error) => {
        setLoading(false);
        setFirstLoad(false);
        throw error;
      });

      setLoading(false);
      setFirstLoad(false);
      setData(result.data.records);
      if (require_total_count) {
        setTotalRecords(result.data.total_records);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async function callNotificationsDelete(item) {
    try {
      item.loading = true;
      const result = await newAlgaehApi({
        uri: "/deleteNotification",
        module: "documentManagement",
        method: "DELETE",
        data: {
          user_id: userToken.employee_id,
          id: item._id,
        },
      }).catch((error) => {
        item.loading = false;
        throw error;
      });
      item.loading = false;
      AlgaehMessagePop({ type: "success", display: result.data.message });
    } catch (e) {
      item.loading = false;
      console.error(e);
    }
  }
  function showTotal() {
    return `Total ${totalRecords} items`;
  }

  return (
    <>
      {data.length === 0 ? (
        <Spin spinning={firstLoad} tip="Please wait getting your notifications">
          <Empty description="Nothing for you now, Come back later" />
        </Spin>
      ) : (
        <List
          className="demo-loadmore-list"
          bordered
          itemLayout="horizontal"
          dataSource={data}
          pagination={{
            pageSize: perPage,
            showLessItems: true,
            size: "small",
            pageSizeOptions: [10, 20, 50],
            total: totalRecords, //Math.ceil(totalRecords / perPage),
            showTotal: showTotal,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          renderItem={(item) => {
            return (
              <List.Item
                key={item._id}
                actions={[
                  <>
                    {isToday ? null : (
                      <Button
                        type="ghost"
                        shape="circle"
                        danger
                        icon={
                          <i className="fas fa-trash" loading={item.loading} />
                        }
                        onClick={async () => {
                          await callNotificationsDelete({ ...item });
                          await callNotifications({
                            require_total_count: true,
                          });
                        }}
                      />
                    )}
                    {item.pageToRedirect && isToday ? (
                      <Link>
                        <i
                          class="fas fa-external-link-alt"
                          onClick={(e) => {
                            e.preventDefault();
                            history.push(`${item.pageToRedirect}`, {
                              data: item.savedData[0],
                              title: item.title,
                            });
                          }}
                        ></i>
                      </Link>
                    ) : null}
                  </>,
                ]}
              >
                <Skeleton avatar title={false} loading={loading} active>
                  <List.Item.Meta
                    title={
                      <>
                        {item.title || "Title"}
                        <small>
                          &nbsp; ({" "}
                          {moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                          )
                        </small>
                      </>
                    }
                    avatar={
                      <Avatar
                        icon={<i className="fas fa-envelope-square"></i>}
                      />
                    }
                    description={
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.message,
                        }}
                      ></span>
                    }
                  />
                </Skeleton>
              </List.Item>
            );
          }}
        />
      )}
    </>
  );
}
