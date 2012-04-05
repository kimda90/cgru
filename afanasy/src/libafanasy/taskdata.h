#pragma once

#include "af.h"

namespace af
{
class TaskData : public Af
{
public:

	TaskData();

	TaskData( Msg * msg);

	/// Construct data from JSON:
	TaskData( JSON & i_value);

	virtual ~TaskData();

	int calcWeight() const;                         ///< Calculate and return memory size.
	void generateInfoStream( std::ostringstream & stream, bool full = false) const; /// Generate information.

	inline const std::string & getName()        const { return m_name;        }
	inline const std::string & getCommand()     const { return m_command;     }
	inline const std::string & getFiles()       const { return m_files;       }
	inline const std::string & getDependMask()  const { return m_depend_mask; }
	inline const std::string & getCustomData()  const { return m_custom_data; }

	inline void setFiles(      const std::string & str) { m_files       = str;  }
	inline void setDependMask( const std::string & str) { m_depend_mask = str;  }
	inline void setCustomData( const std::string & str) { m_custom_data = str;  }

	inline bool hasFiles()        const { return       m_files.empty() == false;}  ///< Whether files are set.
	inline bool hasDependMask()   const { return m_depend_mask.empty() == false;}  ///< Whether depend mask is set.
	inline bool hasCustomData()   const { return m_custom_data.empty() == false;}  ///< Whether files are set.

	bool checkDependMask( const std::string & str);

	void jsonWrite( std::ostringstream & stream);

protected:
	std::string m_name;        ///< Task name.
	std::string m_command;     ///< Command.
	std::string m_files;       ///< Files.
	std::string m_depend_mask;  ///< Dependences.
	std::string m_custom_data;  ///< Some custom data.

protected:
	/// Read or write task data.
	virtual void readwrite( Msg * msg);
};
}
