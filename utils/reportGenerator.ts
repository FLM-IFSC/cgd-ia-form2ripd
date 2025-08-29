import { toast } from 'react-toastify';
import { WIZARD_STEPS } from '../constants/wizardSteps';
import type { FormData, CustomEntries, Field } from '../types';

// Augment the global Window interface for html-docx-js and FileSaver
declare global {
  interface Window {
    htmlDocx: {
      asBlob: (html: string, options?: any) => Blob;
    };
    saveAs: (blob: Blob, filename: string) => void;
  }
}

const composeReportText = (formData: FormData, customEntries: CustomEntries): { [key: string]: string } => {
    const texts: { [key: string]: string } = {};
    const findOptionText = (field: Field, key: string): string => {
        const option = field.options?.find(opt => (typeof opt === 'object' ? opt.key === key : opt === key));
        return typeof option === 'object' ? option.text : (option || key);
    };

    // 1. Introdução
    const campusName = (formData.intro?.campusName as string) || '[NÃO INFORMADO]';
    texts.intro = `Este relatório detalha as medidas técnicas e organizacionais de segurança implementadas pelo IFSC - Câmpus ${campusName} para o tratamento de dados biométricos faciais. Seu objetivo principal é demonstrar a capacidade de prevenir acessos não autorizados, perdas, ou qualquer outra forma de tratamento inadequado, em aderência à Lei nº 13.709/2018 (LGPD).`;

    // 2. Escopo
    const ambientesField = WIZARD_STEPS[0].fields.find(f => f.id === 'ambientesCobertos');
    const ambientes = (formData.intro?.ambientesCobertos as string[])?.map(key => findOptionText(ambientesField!, key)).join(', ').replace('Outro(s) ambiente(s)', '').replace(/, $/, '');
    const customAmbientes = customEntries['intro-ambientesCobertos']?.join(', ');
    const fullAmbientes = [ambientes, customAmbientes].filter(Boolean).join(', ');
    const numDevices = (formData.intro?.numeroDispositivos as string) || 'um número não especificado de';
    
    const brandsField = WIZARD_STEPS[1].fields.find(f => f.id === 'brands');
    const brands = (formData.systemDetails?.brands as string[])?.map(key => findOptionText(brandsField!, key)).join(', ').replace('Outra(s) marca(s)', '').replace(/, $/, '');
    const customBrands = customEntries['systemDetails-brands']?.join(', ');
    const fullBrands = [brands, customBrands].filter(Boolean).join(', ');
    const installType = formData.systemDetails?.installationType === 'local' ? 'local (On-Premise)' : 'gerenciada por terceiros (nuvem)';
    
    let escopoText = `Este relatório abrange as medidas de segurança aplicadas ao sistema de controle de acesso biométrico facial utilizado em ${fullAmbientes || 'ambientes não especificados'}. O sistema consiste em aproximadamente ${numDevices} dispositivos.`;
    if (fullBrands) {
        escopoText += ` Os equipamentos são majoritariamente da(s) marca(s): ${fullBrands}.`;
    }
    escopoText += ` A infraestrutura da solução é ${installType}.`;
    if (formData.systemDetails?.installationType === 'terceirizado') {
      const provider = (formData.systemDetails?.providerName as string) || 'empresa não informada';
      const location = (formData.systemDetails?.dataLocation as string) || 'local não informado';
      escopoText += ` A solução é fornecida pela empresa ${provider}, com dados armazenados primariamente no seguinte país/região: ${location}.`;
    }
    texts.escopo = escopoText;
    
    // 3. Medidas Técnicas
    let techMeasuresText = "";
    WIZARD_STEPS[2].fields.forEach(field => {
      const selection = (formData.technicalMeasures?.[field.id] as string[]) || [];
      if (selection.includes('naoSei')) {
        techMeasuresText += `<p><strong>${field.label}:</strong> As medidas para este controle não foram avaliadas neste momento.</p>`;
      } else if (selection.length > 0) {
        const selectedTexts = selection.map(key => findOptionText(field, key)).filter(t => !t.includes('Outro')).join(' ');
        const custom = customEntries[`technicalMeasures-${field.id}`]?.join(', ');
        techMeasuresText += `<p><strong>${field.label}:</strong> ${selectedTexts}`;
        if (custom) techMeasuresText += ` Adicionalmente, foram implementados os seguintes controles: ${custom}.`;
        techMeasuresText += '</p>';
      }
    });
    texts.technicalMeasures = techMeasuresText.trim();

    // 4. Medidas Organizacionais
    let orgMeasuresText = "";
    let helpNeeded: string[] = [];
    WIZARD_STEPS[3].fields.forEach(field => {
      const selection = (formData.organizationalMeasures?.[field.id] as string[]) || [];
      if (selection.includes('precisaAjuda')) {
        orgMeasuresText += `<p><strong>${field.label}:</strong> O alinhamento sobre este tópico não foi avaliado e foi solicitada ajuda da DTIC.</p>`;
        helpNeeded.push(field.label);
      } else if (selection.length > 0) {
         const selectedTexts = selection.map(key => findOptionText(field, key)).filter(t => !t.includes('Outro')).join(' ');
         const custom = customEntries[`organizationalMeasures-${field.id}`]?.join(', ');
         orgMeasuresText += `<p><strong>${field.label}:</strong> ${selectedTexts}`;
         if(custom) orgMeasuresText += ` Adicionalmente: ${custom}.`;
         orgMeasuresText += '</p>';
      }
    });
    texts.organizationalMeasures = orgMeasuresText.trim();

    // 5. Auditorias
    const auditSelection = (formData.conclusion?.auditorias as string[]) || [];
    const auditsField = WIZARD_STEPS[4].fields.find(f => f.id === 'auditorias');
    if (auditSelection.includes('semTestes')) {
      texts.audits = 'Nenhum teste de segurança formal, como pentests ou scans de vulnerabilidade, foi realizado para este sistema até o momento, conforme informado.';
    } else if (auditSelection.length > 0) {
      const selectedTexts = auditSelection.map(key => findOptionText(auditsField!, key)).filter(t => !t.includes('Outro')).join(' ');
      const custom = customEntries['conclusion-auditorias']?.join(', ');
      texts.audits = `São realizadas as seguintes avaliações de segurança: ${selectedTexts}`;
      if(custom) texts.audits += ` Adicionalmente: ${custom}.`;
    } else {
      texts.audits = 'Não foram fornecidas informações sobre auditorias e testes de segurança.'
    }
    
    // 6. Recomendações e Conclusão
    let recommendations = (formData.conclusion?.melhorias as string) || '';
    if (helpNeeded.length > 0) {
      recommendations += `\n\nRecomenda-se que a DTIC entre em contato com a equipe do câmpus para prestar suporte nos seguintes tópicos: ${helpNeeded.join(', ')}.`;
    }
    texts.recommendations = recommendations.trim().replace(/\n/g, '<br>') || 'Nenhuma recomendação adicional foi inserida.';
    
    const secLevel = (formData.conclusion?.nivelSeguranca as string) || 'não avaliado';
    texts.conclusion = `As medidas implementadas demonstram um compromisso com a proteção dos dados biométricos. O sistema atual oferece um nível de segurança percebido como ${secLevel.toLowerCase()}, alinhado com os requisitos da LGPD e com um plano de melhoria contínua para mitigar riscos emergentes.`;

    return texts;
};

export const generateDocx = (formData: FormData, customEntries: CustomEntries): void => {
    if (!window.htmlDocx || !window.saveAs) {
        toast.error("Erro: A biblioteca de geração de documentos não está disponível.");
        return;
    }
    
    const texts = composeReportText(formData, customEntries);
    const campusName = (formData.intro?.campusName as string) || 'IFSC';

    const contentHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Calibri, sans-serif; font-size: 11pt; }
          h1 { color: #00844f; font-size: 16pt; }
          p { margin-bottom: 12pt; }
          .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #ccc; margin-bottom: 20px;}
          .header-text { font-size: 12pt; font-weight: bold; color: #333; }
          .aside { color: #999999; font-size: 9pt; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="header-text">Instituto Federal de Santa Catarina</span>
          <span class="header-text">RELATÓRIO TÉCNICO DE SEGURANÇA BIOMÉTRICA</span>
        </div>
        <p class="aside">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
        <p class="aside">Este documento é um rascunho gerado por assistente e deve ser validado por um especialista.</p>

        <h1>1. INTRODUÇÃO</h1>
        <p>${texts.intro}</p>

        <h1>2. ESCOPO</h1>
        <p>${texts.escopo}</p>

        <h1>3. MEDIDAS DE SEGURANÇA TÉCNICAS</h1>
        <div>${texts.technicalMeasures}</div>

        <h1>4. MEDIDAS DE SEGURANÇA ORGANIZACIONAIS</h1>
        <div>${texts.organizationalMeasures}</div>

        <h1>5. AUDITORIAS E TESTES</h1>
        <p>${texts.audits}</p>

        <h1>6. RECOMENDAÇÕES E MELHORIAS</h1>
        <p>${texts.recommendations}</p>

        <h1>7. CONCLUSÃO</h1>
        <p>${texts.conclusion}</p>
      </body>
      </html>
    `;

    const converted = window.htmlDocx.asBlob(contentHtml);
    window.saveAs(converted, `Relatorio_Biometria_${campusName}.docx`);
    toast.success("Relatório gerado com sucesso!");
};

export const generateCsv = (formData: FormData, customEntries: CustomEntries): void => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Passo,Campo,Seleção,Valores Customizados\r\n";

    WIZARD_STEPS.forEach(step => {
        step.fields.forEach(field => {
            const value = formData[step.id]?.[field.id] || 'N/A';
            const custom = customEntries[`${step.id}-${field.id}`]?.join('; ') || 'N/A';
            csvContent += `"${step.title}","${field.label}","${Array.isArray(value) ? value.join('; ') : value}","${custom}"\r\n`;
        });
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const campusName = (formData.intro?.campusName as string) || 'IFSC';
    link.setAttribute("download", `diagnostico_biometria_${campusName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};