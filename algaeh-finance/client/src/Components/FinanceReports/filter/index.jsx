import React, { memo, useState, useEffect } from "react";
import {
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehButton,
  Checkbox,
} from "algaeh-react-components";
// import moment from "moment";
import details from "./data";
export default memo(function (props) {
  const { filters, callBack, triggerUpdate } = props;
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [dependency, setDependency] = useState(undefined);
  /*
     filter : its an array of objects which have 
     //AC: AlgaehAutoComplete||AlgaehDateHandler(Range),data:string, others:object,
     //className:string,title:string
     [{type:"AC",data:"PERIOD",others:{},className:"",title:""}
     {type:"DH|RANGE" data:""}]
   */
  useEffect(() => {
    let initStates = {};
    filters
      .filter((f) => f.initalStates !== undefined)
      .forEach((item) => {
        const hasTitle =
          typeof item.data === "string" && item.title === undefined
            ? item.data.toUpperCase().replace(/ /gi, "")
            : item.title.toUpperCase().replace(/ /gi, "");
        if (hasTitle !== undefined && hasTitle !== "") {
          initStates[hasTitle] = item["initalStates"];
        }
      });
    if (Object.keys(initStates).length > 0) setInputs(initStates);
  }, [triggerUpdate]); // eslint-disable-line

  function updateInput(obj) {
    setInputs((result) => {
      return { ...result, ...obj };
    });
  }
  function onPreviewClick() {
    if (Object.keys(inputs).length > 0) {
      setLoading(true);
      if (typeof callBack === "function")
        callBack(inputs, () => {
          setLoading(false);
        });
    }
  }

  return (
    <>
      <div className="col-12 financeGroupFilter">
        {filters.map((records, idx) => (
          <div className="row" key={idx}>
            {records.map((filter, index) => {
              const {
                type,
                className,
                title,
                data,
                component,
                others,
                maxDate,
                minDate,
                onChange,
                dependent,
                isImp,
                onClear,
              } = filter;

              if (component !== undefined) {
                return component;
              }
              const dta = typeof data === "string" ? details[data] : data;
              const hasComponent = type.includes("DH") ? "DH" : type;
              const oth = others !== undefined ? { others: others } : {};
              const int =
                typeof data === "string" && title === undefined
                  ? data.toUpperCase().replace(/ /gi, "")
                  : title.toUpperCase().replace(/ /gi, "");
              let name = title === undefined ? data : title;
              switch (hasComponent) {
                case "AC":
                  return (
                    <AlgaehAutoComplete
                      key={index}
                      div={{
                        className: className === undefined ? "col" : className,
                      }}
                      label={{
                        forceLabel: title === undefined ? data : title,
                        isImp: isImp === undefined ? false : isImp,
                      }}
                      selector={{
                        value: inputs[int],
                        ...dta,
                        onChange: (_, value) => {
                          let dpt = {};

                          if (dependent !== undefined) {
                            let depen = {};
                            const { depend } = _;
                            dependent.forEach((item) => {
                              const itm = item.toUpperCase().replace(/ /gi, "");
                              depen[itm] =
                                depend !== undefined ? depend.type : "";
                              dpt[itm] =
                                depend !== undefined ? depend.value : "";
                              if (
                                depend !== undefined &&
                                depend.title !== undefined
                              ) {
                                depen[`title_${itm}`] = depend["title"];
                              }
                            });
                            setDependency((state) => {
                              return { ...state, ...depen };
                            });
                          }

                          updateInput({ [int]: value, ...dpt });

                          if (typeof onChange === "function")
                            onChange(value, inputs, updateInput);
                        },
                        onClear: () => {
                          updateInput({ [int]: undefined });
                          if (typeof onChange === "function")
                            onClear(updateInput);
                        },
                        ...oth,
                      }}
                    />
                  );
                case "DH":
                  const hasType = type.split("|");
                  let typeString = "";
                  if (hasType.length >= 1) {
                    typeString = hasType[1].toLowerCase();
                  }

                  if (dependency !== undefined) {
                    if (dependency[int] !== undefined) {
                      typeString = dependency[int];

                      if (dependency[`title_${int}`] !== undefined) {
                        name = dependency[`title_${int}`];
                      }
                    }
                  }
                  const dtype =
                    typeString !== "" ? { type: typeString.toLowerCase() } : {};

                  return (
                    <AlgaehDateHandler
                      key={index}
                      div={{
                        className: className === undefined ? "col" : className,
                      }}
                      label={{
                        forceLabel: name,
                        isImp: isImp === undefined ? false : isImp,
                      }}
                      maxDate={maxDate}
                      minDate={minDate}
                      {...dtype}
                      textBox={{
                        value: inputs[int],
                      }}
                      events={{
                        onChange: (selected) => {
                          if (typeof onChange === "function")
                            onChange(selected, inputs, updateInput);
                          else {
                            if (selected === null) {
                              updateInput({ [int]: undefined });
                            } else {
                              if (typeString !== "" && typeString === "year") {
                                updateInput({
                                  [int]: selected.year().toString(),
                                });
                              } else {
                                updateInput({
                                  [int]: selected,
                                });
                              }
                            }
                          }
                        },
                      }}
                      {...oth}
                    />
                  );
                case "CH":
                  return (
                    <Checkbox
                      className={className === undefined ? "col" : className}
                      key={index}
                      checked={inputs[int] === "Y" ? true : false}
                      onChange={(e) => {
                        const checked = e.target.checked ? "Y" : "N";
                        updateInput({ [int]: checked });
                        if (typeof onChange === "function")
                          onChange(checked, inputs);
                      }}
                    >
                      {name}
                    </Checkbox>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
      <div className="col previewReportBtn">
        <AlgaehButton
          className="btn btn-primary"
          onClick={onPreviewClick}
          loading={loading}
        >
          Preview
        </AlgaehButton>
      </div>
    </>
  );
});
