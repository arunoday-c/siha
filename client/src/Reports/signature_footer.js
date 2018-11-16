import seal_stamp from "../assets/images/seal-stamp.png";
export function signature_footer(data) {
  return `
    <div class="signatureDiv">
                <p>Signature:</p>
            </div>
            <div class="hospitalSeal"><img src=${seal_stamp} /></div>
            <div class="doctorName">
                <h6>${data.doctor_name}</h6>
                <p>${data.department ? data.department : ""}</p>
                <p>Registration: DCT45736487</p>
                <p>Mob: +918465335662</p>
            </div>
    `;
}
