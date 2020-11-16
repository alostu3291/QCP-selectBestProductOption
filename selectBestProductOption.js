export function onAfterCalculate(quote, lines) {
    if (lines.length > 0) {
        var sensorProductCodes = [];
        var calibratorProductCodes = [];
        var qcProductCodes = [];

        var bestSensorCode;
        var bestCalibratorCode;
        var bestQCCode;

        lines.forEach(function (line) {
            if (line.record['SBQQ__ProductFamily__c'] === "Sensor Cards") {
                sensorProductCodes.push(line.record['SBQQ__ProductCode__c']);
            } else if (line.record['SBQQ__ProductFamily__c'] === "Calibrator Cartridges") {
                calibratorProductCodes.push(line.record['SBQQ__ProductCode__c']);
            } else if (line.record['SBQQ__ProductFamily__c'] === "QC Packs") {
                qcProductCodes.push(line.record['SBQQ__ProductCode__c']);
            }
        });

        console.log("sensorProductCodes: " + sensorProductCodes + " , calibratorProductCodes: " + calibratorProductCodes + ", qcProductCodes: " + qcProductCodes);
        
        if (sensorProductCodes.length) {
            var testVar = 0;
            lines.forEach(function (line) {
                sensorProductCodes.forEach(function (sensorCode) {
                    if (line.record['SBQQ__ProductCode__c'] == sensorCode && line.record['SBQQ__NetTotal__c'] > testVar) {
                        testVar = line.record['SBQQ__NetTotal__c'];
                        bestSensorCode = sensorCode;
                    }
                });
            });
        }

        if (calibratorProductCodes.length) {
            var testVar = 0;
            lines.forEach(function (line) {
                calibratorProductCodes.forEach(function (calibratorCode) {
                    if (line.record['SBQQ__ProductCode__c'] == calibratorCode && line.record['SBQQ__NetTotal__c'] > testVar) {
                        testVar = line.record['SBQQ__NetTotal__c'];
                        bestCalibratorCode = calibratorCode;
                    }
                });
            });
        }

        if (qcProductCodes.length) {
            var testVar = 0;
            lines.forEach(function (line) {
                qcProductCodes.forEach(function (qcCode) {
                    if (line.record['SBQQ__ProductCode__c'] == qcCode && line.record['SBQQ__NetTotal__c'] > testVar) {
                        testVar = line.record['SBQQ__NetTotal__c'];
                        bestQCCode = qcCode;
                    }
                });
            });
        }

        if (bestSensorCode || bestCalibratorCode || bestQCCode) {
            lines.forEach(function (line) {
                if (line.record['SBQQ__ProductFamily__c'] === "Sensor Cards" && line.record['SBQQ__ProductCode__c'] !== bestSensorCode) {
                    line.record['SBQQ__Optional__c'] = true;
                } else if ( line.record['SBQQ__ProductFamily__c'] === "Calibrator Cartridges" && line.record['SBQQ__ProductCode__c'] !== bestCalibratorCode) {
                    line.record['SBQQ__Optional__c'] = true;
                } else if (line.record['SBQQ__ProductFamily__c'] === "QC Packs" && line.record['SBQQ__ProductCode__c'] !== bestQCCode) {
                    line.record['SBQQ__Optional__c'] = true;
                }
            });
        }

        return Promise.resolve();

    }
}