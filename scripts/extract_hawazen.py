import json, openpyxl
from pathlib import Path
workbook=openpyxl.load_workbook(r'C:/Users/Huawei/Downloads/Financial Study- Hawazen .xlsx',data_only=True)
summary=workbook['STR-Regular Study Summary']
pricing=workbook['STR-Regular Financial Study']
model=dict(units=summary['F6'].value,revenues={'base':summary['F10'].value},occupancy=[round(summary[c].value*100) for c in ['F11','G11','H11']],fees=[dict(key='otaFee',labelKey='otaFee',rate=summary['I14'].value),dict(key='madinumShare',labelKey='madinumShare',rate=summary['I16'].value)],monthlyRate=pricing['H7'].value)
for col in ['F','G','H']:
 gross=model['revenues']['base']*summary[f'{col}11'].value
 net=gross*(1-model['fees'][0]['rate'])*(1-model['fees'][1]['rate'])
 assert abs(net-summary[f'{col}15'].value)<.01
Path('src/data/hawazen.json').write_text(json.dumps({'models':{'str':model}},ensure_ascii=False),encoding='utf8')
print('Verified STR metrics. Exported dashboard inputs only; no cells, formulas or source metadata.')
