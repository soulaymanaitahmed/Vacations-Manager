import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/print.css";
import rm from "../Images/rm.png";
import lg from "../Images/bg1.png";

const PrintComponent2 = React.forwardRef(({ data, dt }, ref) => {
  const getBaseURL = () => {
    if (process.env.NODE_ENV === "development") {
      const { protocol, hostname } = window.location;
      const port = 7766;
      return `${protocol}//${hostname}:${port}`;
    } else {
      return "https://your-backend-url.com";
    }
  };
  const baseURL = getBaseURL();
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
      <span className="n-con661">N° {data.id}</span>
      <h3 className="des-print" id="hhjk88">
        Demande en vue de bénéficier d'un congé Administratif
      </h3>
      <br />
      <p className="dahir" id="silvergray">
        Vu le <b>Dahir 1.58.008</b> du 04 Chaabane 1377 (27 Février 1958)
        portant statut de la fonction puplique.
      </p>
      <br />
      <br />
      <div className="maininfos78" id="ghj6">
        <div className="line56" id="dist55">
          <p className="hbgu7">PPR : </p>
          <p className="hbg8">{dt.ppr}</p>
          <p className="hbgu76">رقم التأجير :</p>
        </div>
        <div className="line56" id="dist55">
          <p className="hbgu7">Nom : </p>
          <p className="hbg8">{dt.nom}</p>
          <p className="hbgu76">الاسم العائلي :</p>
        </div>
        <div className="line56" id="dist55">
          <p className="hbgu7">Prénom : </p>
          <p className="hbg8">{dt.prenom}</p>
          <p className="hbgu76">الاسم الشخصي :</p>
        </div>
        <div className="line56" id="dist55">
          <p className="hbgu7">Grade : </p>
          <p className="hbg8">{dt.corp_name}</p>
          <p className="hbgu76">الدرجة :</p>
        </div>
        <div className="line56" id="dist55">
          <p className="hbgu7">Affectation : </p>
          <p className="hbg8">{dt.formation_sanitaire}</p>
          <p className="hbgu76">مقر العمل :</p>
        </div>
        <div className="line56" id="dist55">
          <p className="hbgu7">N° de téléphone : </p>
          <p className="hbg8">{dt.phone}</p>
          <p className="hbgu76">رقم الهاتف :</p>
        </div>
      </div>
      <br />
      <br />
      <p className="dahir">
        {settings.delegue_gender === 1
          ? "Monsieur le Délégué,"
          : "Madame la Déléguée,"}
        <br />
        Par le présente, je vous prie de bien vouloir m'acorder{" "}
        <b>{data.total_duration} jours </b> de congé:
      </p>
      <p className="dahir">
        <u>
          <b>
            {data.type === 1
              ? "Annuel"
              : data.type === 2
              ? "Exceptionnel"
              : data.type === 3
              ? "D'autorisation d'absence"
              : data.type === 21
              ? "De Maternité"
              : data.type === 22
              ? "De Paternité"
              : null}
          </b>
        </u>
        <b>
          {data.quitter === 1 && data.type === 1
            ? " Avec autorisation de quitter le territoire."
            : data.quitter === 0 && data.type === 1
            ? " Sans autorisation de quitter le territoire."
            : null}
        </b>
      </p>
      <br />
      <p className="dahir">
        Au titre de l'année : <b>{data.year_1} </b>
        {data.year_2 ? (
          <span className="grt78">
            ({data.duration_1}) <b>/</b> {data.year_2} ({data.duration_2})
          </span>
        ) : null}
      </p>
      <br />
      <div className="maininfos78" id="ghj6">
        <div className="line56" id="kkopu6">
          <p className="hbgu78">Du : </p>
          <p className="hhfhggt1">{formatDate(data.start_at)}</p>
        </div>
        <div className="line56" id="kkopu6">
          <p className="hbgu78">Au : </p>
          <p className="hhfhggt1">{formatDate(data.end_at)}</p>
        </div>
      </div>
      <br />
      <p className="dahir" id="silvergray">
        Veuillez agréer,{" "}
        {settings.delegue_gender === 1
          ? "Monsieur le Délégué"
          : "Madame la Déléguée"}
        , l'expression de mes salutations distinguées.
      </p>
      <br />
      <div className="kknyi5">
        <div className="agentsing">
          <span className="sintitre">Signature de l'agent</span>
        </div>
        <b className="hhfhggt">
          Ouarzazate le : {formatDate(data.demand_date)}
        </b>
      </div>
      <br />
      <div className="table55">
        Avis
        <div className="tbgg">
          <div className="col1">
            <span className="cds">Chef archaic</span>
            <span className="cds" id="hhgv55">
              {settings.delegue_gender === 1 ? "Délégué" : "Déléguée"}{" "}
              Provincial
            </span>
          </div>
          <div className="col2">
            <span className="cds1"></span>
            <span className="cds1" id="hhgv55"></span>
          </div>
        </div>
      </div>
      <p className="ft44">
        Cité des Cadres - OUARZAZATE - Tél: 05 24 88 22 00/ 02 - Fax: 05 24 88
        23 94
        <img className="print-logo2" src={lg} alt="Logo" width="40mm" />
      </p>
    </div>
  );
});

export default PrintComponent2;
