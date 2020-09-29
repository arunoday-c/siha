import { AlgaehAutoComplete } from "algaeh-react-components";
import React from "react";
import { useQuery } from "react-query";
import { getProviders } from "./api";

export function InsuranceDropdown({
  value,
  onChange,
  name,
  disabled,
  errors = null,
  div = {},
  label = {},
  placeholder = "",
  others = {},
}) {
  const { data, isLoading } = useQuery("insurance", getProviders, {
    initialData: [],
    initialStale: true,
  });

  return (
    <AlgaehAutoComplete
      div={{ ...div }}
      label={{
        ...label,
      }}
      error={errors}
      selector={{
        name,
        className: "select-fld",
        placeholder,
        dataSource: {
          textField: "insurance_provider_name",
          valueField: "hims_d_insurance_provider_id",
          data,
        },
        value,
        onChange,
        onClear: () => onChange(null),
        others: {
          disabled: disabled || isLoading,
          ...others,
        },
      }}
    />
  );
}
