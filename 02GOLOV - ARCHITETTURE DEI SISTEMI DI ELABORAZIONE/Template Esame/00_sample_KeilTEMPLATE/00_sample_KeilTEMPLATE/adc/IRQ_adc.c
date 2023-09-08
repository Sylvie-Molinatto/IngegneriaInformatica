/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_adc.c
** Last modified Date:  20184-12-30
** Last Version:        V1.00
** Descriptions:        functions to manage A/D interrupts
** Correlated files:    adc.h
**--------------------------------------------------------------------------------------------------------       
*********************************************************************************************************/

#include "lpc17xx.h"
#include "adc.h"

#define AD_max  0xFFF
#define AD_half 0x7FF

/*----------------------------------------------------------------------------
  A/D IRQ: Executed when A/D Conversion is ready (signal from ADC peripheral)
 *----------------------------------------------------------------------------*/

unsigned short AD_val;   
unsigned short AD_last;     /* Last converted value               */

void ADC_IRQHandler(void) {
	AD_val = ((LPC_ADC->ADGDR>>4) & AD_max); /* Read Conversion Result */
}
