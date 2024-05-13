<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- Definirea coloanelor tabelului -->
  <xsl:template match="/">
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nume</th>
          <th>Data nasterii</th>
          <th colspan="3">Istoric medical</th>
          <th>Diagnostic</th>
          <th>Tratament</th>
          <th colspan="2">EEG</th>
        </tr>
        <tr>
          <th>ID</th>
          <th>Nume</th>
          <th>Data nasterii</th>
          <th>Alergii</th>
          <th>Boli cronice</th>
          <th>Antecedente chirurgicale</th>
          <th>Diagnostic</th>
          <th>Tratament</th>
          <th>Data inregistrare EEG</th>
          <th>Interpretare EEG</th>
        </tr>
      </thead>
      <tbody>
        <!-- Apelarea șablonului pentru fiecare pacient -->
        <xsl:apply-templates select="pacienti/pacient"/>
      </tbody>
    </table>
  </xsl:template>

  <!-- Șablonul pentru fiecare pacient -->
  <xsl:template match="pacient">
    <tr>
      <!-- Apply the filter function to the row -->
      <td><xsl:value-of select="position()"/></td>
      <td><xsl:value-of select="nume"/></td>
      <td><xsl:value-of select="data_nastere"/></td>
      <td><xsl:value-of select="istoric_medical/alergii"/></td>
      <td><xsl:value-of select="istoric_medical/boli_cronice"/></td>
      <td><xsl:value-of select="istoric_medical/antecedente_chirurgicale"/></td>
      <td><xsl:value-of select="diagnostic"/></td>
      <td><xsl:value-of select="tratament"/></td>
      <td><xsl:value-of select="eeg/data_inregistrare"/></td>
      <td><xsl:value-of select="eeg/interpretare"/></td>
    </tr>
  </xsl:template>

</xsl:stylesheet>
