import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/print.css";
import rm from "../Images/rm.png";
import lg from "../Images/bg1.png";

import { baseURL } from "../config";

const PrintComponent = React.forwardRef(({ data }, ref) => {
  const [settings, setSettings] = useState({
    delegue_gender: 1,
    delegue: "",
    etablissement: "",
  });
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${baseURL}/settings`);
      if (response.data.length > 0) {
        setSettings(response.data[0]);
      } else {
        console.error("No settings found in response");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, []);

  const typeLabels = {
    1: "Annuel",
    2: "Exceptionnel",
    3: "Aut d'absence",
    11: "C-Maladie C",
    12: "C-Maladie M",
    13: "C-Maladie L",
  };
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatMonthInFrench = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { month: "long" });
  };

  return (
    <div ref={ref} className="print55">
      <div className="header-print">
        <div className="print-h1">
          Royaume du Maroc <br /> Ministère de la Santé <br /> et de la
          Protection sociale <br /> Direction Régionale de la Santé <br /> à la
          Région Dràa-Tafilalet <br /> Délégation d'Ouarzazate
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
      <br />
      <h3 className="des-print">
        <span className="n-con66">N° {data.id}</span>Decision
      </h3>
      <br />
      <br />
      <h4 className="deleg66">
        {settings.delegue_gender === 1 ? "Le Délégué," : "La Déléguée,"} du
        Ministère de la Santé et de la Protection Sociale <br /> à la Province
        d'Ouarzazate
      </h4>
      <br />
      <br />
      <p className="dahir" id="silvergray">
        Vu le <b>Dahir 1.58.008</b> du 04 Chaabane 1377 (27 Février 1958)
        portant statut de la fonction puplique.
        <br />
        <br />
        Vu la demande du congé{" "}
        {data.type < 10
          ? "Administratif"
          : data.type >= 10 && data.type < 20
          ? "Congé de Maladie"
          : data.type === 21
          ? "Congé de Maternité"
          : data.type === 22
          ? "Congé de Paternité"
          : null}{" "}
        <b> {typeLabels[data.type] || "Else"}</b>
        <br /> présentée par l'intéressé (é) le:{" "}
        <b className="datedem551">{formatDate(data.demand_date)}</b>
      </p>
      <br />
      <br />
      <h3 className="des-print">Decide</h3>
      <br />
      <br />
      <p className="dahir">
        Article unique : Un Congé {typeLabels[data.type] || "Else"} de{" "}
        <span className="adlgkj6">
          {formatMonthInFrench(data.start_at)} ({data.total_duration})
        </span>{" "}
        jours ouvrables <br /> au titre{" "}
        {data.year_2 ? "des années" : "de l'année"} <b>{data.year_1}</b>
        {data.year_2 ? " et " + data.year_2 : null} est accordé à :
      </p>
      <br />
      <div className="maininfos78">
        <div className="line56">
          <p className="hbgu7">Nom et prénom : </p>
          <p className="hbg84">{data.nom + " " + data.prenom}</p>
        </div>
        <div className="line56">
          <p className="hbgu7">PPR : </p>
          <p className="hbg84">{data.ppr}</p>
        </div>
        <div className="line56">
          <p className="hbgu7">Grade : </p>
          <p className="hbg84">{data.corp_name}</p>
        </div>
        <div className="line56">
          <p className="hbgu7">Affectation : </p>
          <p className="hbg84">{data.formation_sanitaire}</p>
        </div>
      </div>
      <br />
      <p className="dahir">
        A la Délégation dun Ministére de la Santé et de la Protection Sociale
        àle Province d'Ouarzazate, pur en bénéficier à compter:
      </p>
      <br />
      <div className="maininfos78">
        <div className="line56" id="kkopu6">
          <p className="hbgu78">Du : </p>
          <p className="hbg8">{formatDate(data.start_at)}</p>
        </div>
        <div className="line56" id="kkopu6">
          <p className="hbgu78">Au : </p>
          <p className="hbg8">{formatDate(data.end_at)}</p>
        </div>
      </div>
      <br />
      <h4 className="delgsign">
        Ouarzazate le:
        <br />
        {settings.delegue_gender === 1 ? "Le Délégué," : "La Déléguée,"}{" "}
        Provincial
      </h4>
      <br />
      <div className="ampttg">
        <p className="koyfbdg44">Ampliations</p>
        <p className="list55">- Chef du SRES par intérim;</p>
        <p className="list55">- L'intéressé;</p>
        <p className="list55">- Dossier;</p>
      </div>
      <br />
      <p className="ft44">
        Cité des Cadres - OUARZAZATE - Tél: 05 24 88 22 00/ 02 - Fax: 05 24 88
        23 94
        <img className="print-logo2" src={lg} alt="Logo" width="40mm" />
      </p>
    </div>
  );
});

export default PrintComponent;
