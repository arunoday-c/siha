import React, { useEffect, useState } from "react";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
export default function (props) {
    const [users, setUsers] = useState([]);
    const [selecttedUser, setSelectedUser] = useState(undefined);
    useEffect(() => {
        algaehApiCall({
            uri: "/algaehappuser/getLoginUserMaster",
            method: "GET",
            onSuccess: response => {
                if (response.data.success) {
                    setUsers(response.data.records);
                } else {
                    setUsers([]);
                }
            },
            onCatch: error => {
                swalMessage({
                    title: error.message,
                    type: "error"
                });
                setUsers([]);
            }
        });
    }, []);
    return (<div className="login_users">
        <div className="row">
            <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-body">
                        <AlagehAutoComplete
                            div={{ className: "col-6 form-group" }}
                            label={{
                                fieldName: "role",
                                isImp: true
                            }}
                            selector={{
                                name: "userId",
                                className: "select-fld",
                                value: selecttedUser,
                                dataSource: {
                                    textField: "role_name",
                                    valueField: "app_d_app_roles_id",
                                    data: users
                                },
                                onChange: (e) => {
                                    // debugger;
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>)
}