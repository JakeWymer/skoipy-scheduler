import { useState } from "react";
import ApiClient from "../../api";
import Button from "../../components/Button";
import { GenerateApiKeyResponse } from "./types";

const Settings = () => {
    const [apiKey, setApiKey] = useState<string>(``);

    const generateApiKey = async () => {
        const response = await ApiClient.post<GenerateApiKeyResponse>(`/apikey/generate`, {},`Unable to generate api key`, `Generated api key` );
        setApiKey(response.apiKey);
    }

    return (
        <div>
            <div>
                {apiKey.length && (
                    <div>
                        <h2>Your API key: {apiKey}</h2>
                        <h4>Copy this key down somewhere, you will not be able to view it again!</h4>
                    </div>
                )}
                <Button text="Generate API Key" clickHandler={generateApiKey}/>
            </div>
        </div>
    );
}

export default Settings;