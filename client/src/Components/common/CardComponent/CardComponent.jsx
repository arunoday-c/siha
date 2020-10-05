import {
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehLabel,
} from "algaeh-react-components";
import React, { useEffect } from "react";
import "./CardComponent.scss";
import { useQuery } from "react-query";
import { getCards } from "../../BusinessSetup/CardMaster/api";
import MaskedInput from "react-maskedinput";

export default function CardComponent({
  onChangeCard = () => {},
  onChangeNumber = () => {},
  card_id,
  card_number,
  disabled,
  errors,
}) {
  const { data: cards, isLoading } = useQuery("card", getCards, {
    initialData: [],
    initialStale: true,
  });

  const currentCard = cards?.filter(
    (item) => item?.hims_d_bank_card_id === card_id
  );
  const mask = currentCard?.[0]?.card_format;

  useEffect(() => {
    onChangeCard(null, null);
    onChangeNumber("");
    // eslint-disable-next-line
  }, [disabled]);

  return (
    <>
      <AlgaehAutoComplete
        div={{ className: "col-3  mandatory" }}
        label={{
          forceLabel: "Select Card Type",
          isImp: false,
        }}
        error={errors}
        selector={{
          name: "card_id",
          className: "select-fld",
          dataSource: {
            textField: "card_name",
            valueField: "hims_d_bank_card_id",
            data: cards,
          },
          value: card_id,
          onChange: (obj, value) => onChangeCard(obj, value),
          others: {
            disabled: isLoading || disabled,
          },
        }}
      />

      {mask ? (
        <div className="col no-padding-left-right mandatory cardMaskFld">
          <AlgaehLabel
            label={{ fieldName: "card_check_number", isImp: false }}
          />
          <MaskedInput
            mask={mask}
            className="txt-fld"
            placeholder={"eg: " + mask}
            name="identity_no"
            value={card_number}
            guide={false}
            id="my-input-id"
            onBlur={() => {}}
            onChange={(e) => {
              const { value } = e.target;
              onChangeNumber(value);
            }}
            disabled={isLoading || disabled}
          />
        </div>
      ) : (
        <AlgaehFormGroup
          div={{
            className: "col no-padding-left-right  mandatory",
          }}
          label={{
            fieldName: "card_check_number",
            isImp: false,
          }}
          textBox={{
            className: "txt-fld",
            name: "card_number",
            disabled: true,
          }}
        />
      )}
    </>
  );
}
