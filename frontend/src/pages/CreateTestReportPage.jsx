import React, { useEffect, useState } from "react";
import TestReportForm from "../components/TestReportForm/TestReportForm";
import { createTestReport, fetchParameters } from "../api/testReportApi";
import { useLocation } from "react-router-dom";

const defaultData = {
  testCertNo: "JHTPL/",
  customer: "",
  partName: "",
  material: "",
  partNoQty: [],
  parameters: [],
  surfaceHardnessTraverse: [],
  threadHardnessTraverse: [],
  hardnessSamples: [],
  remarks: "",
  preparedBy: ""
};

const DEFAULT_PARAMETERS = [
  { name: "Heat Treatment", specified: "CHT", actual: "CHT" },
  { name: "Surface Hardness", specified: "58-62 HRC", actual: "37 HRC" },
  { name: "Surface Hardness(After Grinding) ", specified: "58-61 HRC / 80 HRA MIN", actual: "37 HRC" },
  { name: "Core Hardness", specified: "30-39 HRC", actual: "" },
  { name: "Case Depth @OD", specified: "0.50 mm @ 550 HV1", actual: "" },
  { name: "Case Depth @PCD", specified: "0.70-1.00 mm @513Hv1", actual: "0.83mm" },
  { name: "Microstructure-Case", specified: "Tempered Martensite, RA<10%,Carbides in any form are not acceptable.", actual: "Fine Tempered martensite. RA <05%." },
  { name: "Microstructure-Core", specified: "Low Carbon Tempered Martensite", actual: "ow carbon tempered Martensite." },
  { name: "Grain Size 100X ", specified: ">=6", actual: "7" },
  { name: "Thread Hardness ", specified: "450 HV1 Max at CREAST", actual: "381 – 450 HV1" },
  { name: "Carbon Surface Content ", specified: "0.8 – 1.1%", actual: "0.83mm" },
];

export default function CreateTestReportPage() {
  const location = useLocation();
  const [initialData, setInitialData] = useState(defaultData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If state was passed, autofill those fields
    if (location.state) {
      const { customer, partName, material } = location.state;
      setLoading(true);
      // Fetch parameters for this combination, if all present
      if (customer && partName && material) {
        fetchParameters(customer, partName, material).then(res => {
          setInitialData({
            ...defaultData,
            customer: customer || "",
            partName: partName || "",
            material: material || "",
            parameters: res.parameters && res.parameters.length > 0
              ? res.parameters
              : DEFAULT_PARAMETERS
          });
          setLoading(false);
        });
      } else {
        setInitialData({
          ...defaultData,
          customer: customer || "",
          partName: partName || "",
          material: material || ""
        });
        setLoading(false);
      }
    } else {
      setInitialData(defaultData);
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [location.state]);

  return (
    <div>
      {loading ? (
        <div>Loading autofill data...</div>
      ) : (
        <TestReportForm
          initialData={initialData}
          mode="create"
          onSubmit={async data => {
            const res = await createTestReport(data);
            alert(res.message || "Test report created!");
          }}
        />
      )}
    </div>
  );
}
