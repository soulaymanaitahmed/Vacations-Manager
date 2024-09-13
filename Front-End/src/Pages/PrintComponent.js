import React from "react";
import "../Style/print.css";
import rm from "../Images/rm.png";

const PrintComponent = React.forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} className="print55">
      <div className="header-print">
        <div className="print-h1">
          Royaume du Maroc <br /> Ministère de la Santé <br /> et de la
          Protection sociale <br /> Direction Régionale de la Santé <br /> à la
          Région Dràa-Tafilalet Délégation d'Ouarzazate
        </div>
        <div className="print-h1">
          <img className="print-logo" src={rm} alt="Logo" width="25mm" />
        </div>
        <div className="print-h1">
          المملكة المغربية <br /> ⵜⴰⴳⵍⴷⵉⵜ ⵏ ⵍⵎⵖⵔⵉⴱ <br /> وزارة الصحة والحماية
          الإجتماعية <br /> ⵜⴰⵎⴰⵡⴰⵙⵜ ⵏ ⵜⴷⵓⵙⵉ ⴷ ⴰⵏⴰⵎⵓⵏ <br /> المديرية الجهوية
          للصحة <br /> لجهة درعة تافيلالت <br /> مندوبية ورززات
        </div>
      </div>
      <h3 className="des-print">
        <span className="n-con66">N° {data.id}</span>Decision
      </h3>
      <h4 className="deleg66">
        Le Délégué du Ministère de la Santé et de la Protection Sociale à la
        Province d'Ouarzazate
      </h4>
      <p className="dahir">
        Vu le <b>Dahir 1.58.008</b> du 04 Chaabane
      </p>
      <p>
        <strong>Decision:</strong> {data.decision}
      </p>
      <p>
        <strong>Type:</strong> {data.type}
      </p>
      <p>
        <strong>Total Duration:</strong> {data.total_duration}
      </p>
      <p>
        <strong>Year 1:</strong> {data.year_1} ({data.duration_1} months)
      </p>
      <p>
        <strong>Year 2:</strong> {data.year_2 || "N/A"} (
        {data.duration_2 || "N/A"} months)
      </p>
      <p>
        <strong>Start At:</strong>{" "}
        {new Date(data.start_at).toLocaleDateString()}
      </p>
      <p>
        <strong>End At:</strong> {new Date(data.end_at).toLocaleDateString()}
      </p>
      <p>
        <strong>Demand Date:</strong>{" "}
        {new Date(data.demand_date).toLocaleDateString()}
      </p>
      <p>
        <strong>Nom:</strong> {data.nom}
      </p>
      <p>
        <strong>Prénom:</strong> {data.prenom}
      </p>
      <p>
        <strong>Grade Name:</strong> {data.grade_name}
      </p>
      <p>
        <strong>Corp Name:</strong> {data.corp_name}
      </p>
      <p>
        <strong>Formation Sanitaire:</strong> {data.formation_sanitaire}
      </p>
      <p>
        <strong>Type Name:</strong> {data.type_name}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(data.created_at).toLocaleDateString()}
      </p>
    </div>
  );
});

export default PrintComponent;
