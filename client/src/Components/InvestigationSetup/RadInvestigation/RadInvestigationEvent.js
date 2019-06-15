import { successfulMessage } from "../../../utils/GlobalFunctions";

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value
    });
  }
};

const ViewEditTemplate = ($this, row) => {
  let template = {
    template_html: row.template_html,
    template_name: row.template_name,
    hims_d_rad_template_detail_id: row.hims_d_rad_template_detail_id
  };
  $this.setState({
    ...$this.state,
    openTemplate: !$this.state.openTemplate,
    radTempobj: template
  });
};

const ShowTemplate = $this => {
  $this.setState({
    ...$this.state,
    openTemplate: !$this.state.openTemplate,
    radTempobj: null
  });
};

const CloseTemplate = ($this, data) => {
  let radObj = {
    template_name: data.template_name,
    template_html: data.template_html
  };
  let insert_rad_temp = $this.state.insert_rad_temp;
  let RadTemplate = $this.state.RadTemplate;
  let Updateobj = {};
  if (
    data.hims_d_rad_template_detail_id !== 0 &&
    data.hims_d_rad_template_detail_id === null
  ) {
    RadTemplate.push(radObj);

    radObj.test_id = $this.state.hims_d_investigation_test_id;
    radObj.hims_d_rad_template_detail_id = null;
    insert_rad_temp.push(radObj);

    $this.setState({
      openTemplate: !$this.state.openTemplate,
      RadTemplate: RadTemplate,
      insert_rad_temp: insert_rad_temp
    });
  } else {
    if (data.hims_d_rad_template_detail_id !== 0) {
      let update_rad_temp = $this.state.update_rad_temp;

      for (let i = 0; i < RadTemplate.length; i++) {
        if (
          RadTemplate[i].hims_d_rad_template_detail_id ===
          data.hims_d_rad_template_detail_id
        ) {
          RadTemplate[i].template_name = data.template_name;
          RadTemplate[i].template_html = data.template_html;
        }
      }

      Updateobj = {
        template_name: data.template_name,
        template_html: data.template_html,
        hims_d_rad_template_detail_id: data.hims_d_rad_template_detail_id,
        template_status: "A",
        record_status: "A"
      };
      update_rad_temp.push(Updateobj);
      $this.setState({
        openTemplate: !$this.state.openTemplate,
        RadTemplate: RadTemplate,
        update_rad_temp: update_rad_temp,
        record_status: "A"
      });
    } else if (data.hims_d_rad_template_detail_id === null) {
    } else {
      $this.setState({
        openTemplate: !$this.state.openTemplate
      });
    }
  }
};

const deleteRadInvestigation = ($this, context, row, rowId) => {
  let RadTemplate = $this.state.RadTemplate;
  let update_rad_temp = $this.state.update_rad_temp;
  let insert_rad_temp = $this.state.insert_rad_temp;
  if (
    $this.state.hims_d_investigation_test_id !== null &&
    row.hims_d_rad_template_detail_id !== null
  ) {
    let Updateobj = {
      hims_d_rad_template_detail_id: row.hims_d_rad_template_detail_id,
      template_name: row.template_name,
      template_html: row.template_html,
      record_status: "I"
    };
    update_rad_temp.push(Updateobj);
  } else {
    if (insert_rad_temp.length > 0) {
      for (let k = 0; k < insert_rad_temp.length; k++) {
        if (insert_rad_temp[k].template_name === row.template_name) {
          insert_rad_temp.splice(k, 1);
        }
      }
    }
  }

  for (let i = 0; i < RadTemplate.length; i++) {
    if (RadTemplate[i].template_name === row.template_name) {
      RadTemplate.splice(i, 1);
    }
  }
  // RadTemplate.splice(rowId, 1);
  $this.setState({
    RadTemplate: RadTemplate,
    insert_rad_temp: insert_rad_temp,
    update_rad_temp: update_rad_temp
  });

  if (context !== undefined) {
    context.updateState({
      RadTemplate: RadTemplate,
      insert_rad_temp: insert_rad_temp,
      update_rad_temp: update_rad_temp
    });
  }
};

const updateRadInvestigation = $this => {
  successfulMessage({
    message: "No Option to edit.",
    title: "Warning",
    icon: "warning"
  });
};

export {
  texthandle,
  ShowTemplate,
  CloseTemplate,
  ViewEditTemplate,
  deleteRadInvestigation,
  updateRadInvestigation
};
