import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/print.css";
import rm from "../Images/rm.png";
import lg from "../Images/bg1.png";

import { baseURL } from "../config";

const PrintComponent3 = React.forwardRef(({ data }, ref) => {
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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div ref={ref} className="print55">
      <div className="header-print">
        <div className="print-h1">
          Royaume du Maroc <br /> Ministère de la Santé <br /> et de la
          Protection sociale <br /> Direction Régionale de la Santé <br /> à la
          Région Dràa-Tafilalet
          <br />
          Délégation d'Ouarzazate
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
      <br />
      <br />
      <h3 className="des-print">Attestation de Travail</h3>
      <br />
      <br />
      <br />
      <br />
      <br />
      <p className="dahir">
        {settings.delegue_gender === 1 ? "Le Délégué" : "La Déléguée"} du
        Ministère de la Santé et de Protection Sociale à la Province
        d'Ouarzazate, atteste par la présente que :
      </p>
      <br />
      <br />
      <br />
      <div className="maininfos78" id="kkng55">
        <div className="line56">
          <p className="hbgu71">Nom et prénom : </p>
          <p className="hbg81">{data.nom + " " + data.prenom}</p>
        </div>
        <div className="line56">
          <p className="hbgu71">CIN : </p>
          <p className="hbg81">{data.cin}</p>
        </div>
        <div className="line56">
          <p className="hbgu71">PPR : </p>
          <p className="hbg81">{data.ppr}</p>
        </div>
        <div className="line56">
          <p className="hbgu71">Grade : </p>
          <p className="hbg81">{data.corp_name}</p>
        </div>
        <div className="line56">
          <p className="hbgu71">Date de recrutement : </p>
          <p className="hbg81">{formatDate(data.date_affect)}</p>
        </div>
      </div>
      <br />
      <br />
      <br />
      <p className="dahir">
        Est en fonction à la Délégation du Ministère de la Santé et de la
        protection Sociale à la Province d'Ouarzazate.
      </p>
      <br />
      <p className="dahir">
        La présence attestation est délivrée à l'intéressé
        {data.gander === 0 ? "e" : null} sur sa demande pour servir et valoir ce
        que de droit.
      </p>
      <br />
      <br />
      <h4 className="delgsign44">
        Ouarzazate le:{" "}
        {settings.delegue_gender === 1 ? "Le Délégué" : "La Déléguée"}{" "}
        Provincial
      </h4>
      <br />
      <p className="ft44">
        Cité des Cadres - OUARZAZATE - Tél: 05 24 88 22 00/ 02 - Fax: 05 24 88
        23 94
        <img className="print-logo2" src={lg} alt="Logo" width="40mm" />
      </p>
    </div>
  );
});

export default PrintComponent3;
